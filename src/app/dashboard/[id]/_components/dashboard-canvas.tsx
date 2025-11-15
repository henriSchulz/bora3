"use client";

import React, { useState, useEffect, useRef } from "react";
import { DndContext, DragEndEvent, DragCancelEvent } from "@dnd-kit/core";
import WidgetRenderer from "./widget-renderer";
import { IWidget } from "@/widgets/core/autogen.types";
import { Dashboard } from "@prisma/client";
import { updatePositions } from "../actions";
import { useKeyboardShortcuts } from "@/components/hooks/use-keyboard-shortcuts";
import ResizableContainer from "@/components/resizable-container";

interface DashboardCanvasProps {
  initialWidgets: IWidget[];
  dashboard: Dashboard;
  editMode: boolean;
}

export default function DashboardCanvas({
  initialWidgets,
  dashboard,
  editMode,
}: DashboardCanvasProps) {
  //const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<IWidget[]>(initialWidgets);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const debounceSaveRef = useRef<NodeJS.Timeout | null>(null);


  useEffect(() => {
    const newWidgetsMap = new Map(initialWidgets.map((w) => [w.id, w]));
    setWidgets((currentWidgets) => {
      return currentWidgets
        .map((currentWidget) => {
          const newWidgetData = newWidgetsMap.get(currentWidget.id);
          if (newWidgetData) {
            return {
              ...newWidgetData,
              position: currentWidget.position,
            };
          }
          return null;
        })
        .filter(Boolean) as IWidget[];
    });
  }, [initialWidgets]);

  // NEUER useEffect für Auto-Save (ersetzt den alten)
  useEffect(() => {
    // 1. Nur im Edit-Modus und nicht beim ersten Laden speichern
    if (!editMode || widgets === initialWidgets) {
      return;
    }

    // 2. Wenn schon ein Timer läuft (Benutzer ist noch aktiv), lösche ihn
    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
    }

    // 3. Starte einen neuen Timer...
    debounceSaveRef.current = setTimeout(() => {
      console.log("Auto-saving layout...");

      // 4. Deine bestehende 'updatePositions'-Action ist perfekt,
      //    da sie den *gesamten* aktuellen Layout-State speichert.
      updatePositions(dashboard.id, widgets);
    }, 1500); // 1.5 Sekunden warten (kannst du anpassen)

    // 5. Cleanup-Funktion (wichtig, falls die Komponente verlässt)
    return () => {
      if (debounceSaveRef.current) {
        clearTimeout(debounceSaveRef.current);
      }
    };

    // Dieser Effekt hängt vom 'widgets'-State ab.
  }, [widgets, dashboard.id, editMode, initialWidgets]);

  // Event called when dropping a widget
  function handleDragEnd(event: DragEndEvent) {
    document.body.classList.remove("dragging-no-scroll");

    if (!editMode) return;
    const { active, delta } = event;
    const widgetId = active.id;

    const activeRect = active.rect.current;

    const rect = activeRect.translated ?? activeRect.initial;
    if (!rect || containerSize.width === 0 || containerSize.height === 0) {
      return;
    }

    const widgetWidth = rect.width;
    const widgetHeight = rect.height;

    setWidgets((currentWidgets) =>
      currentWidgets.map((w) => {
        if (w.id === widgetId) {
          const newX = w.position.x + delta.x / containerSize.width;
          const newY = w.position.y + delta.y / containerSize.height;

          const halfWidthPercent = widgetWidth / 2 / containerSize.width;
          const halfHeightPercent = widgetHeight / 2 / containerSize.height;

          const minX = halfWidthPercent;
          const maxX = 1 - halfWidthPercent;
          const minY = halfHeightPercent;
          const maxY = 1 - halfHeightPercent;

          const clampedX = Math.max(minX, Math.min(newX, maxX));
          const clampedY = Math.max(minY, Math.min(newY, maxY));

          return {
            ...w,
            position: {
              x: clampedX,
              y: clampedY,
            },
          };
        }
        return w;
      })
    );
  }

  function handleDragCancel(event: DragCancelEvent) {
    document.body.classList.remove("dragging-no-scroll");
  }

  return (
    <ResizableContainer
      className="p-14 border shadow rounded relative h-[80vh] w-full"
      style={{
        backgroundImage: dashboard.schematicImagePath
          ? `url(${dashboard.schematicImagePath})`
          : "none",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {(size) => {
        // Update container size state if it has changed
        if (
          size.width !== containerSize.width ||
          size.height !== containerSize.height
        ) {
          setContainerSize(size);
        }
        return (
          <DndContext onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
            {widgets.map((widget) => (
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                editMode={editMode}
              />
            ))}
          </DndContext>
        );
      }}
    </ResizableContainer>
  );
}
