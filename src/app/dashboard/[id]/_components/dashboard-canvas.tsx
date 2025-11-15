'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DndContext, DragEndEvent, DragCancelEvent } from '@dnd-kit/core';
import WidgetRenderer from './widget-renderer';
import { IWidget } from '@/widgets/core/autogen.types';
import { Dashboard } from '@prisma/client';
import { updatePositions } from '../actions';
import { useKeyboardShortcuts } from '@/components/hooks/use-keyboard-shortcuts';
import ResizableContainer from '@/components/resizable-container';

interface DashboardCanvasProps {
  initialWidgets: IWidget[];
  dashboard: Dashboard;
  editMode: boolean
}

export default function DashboardCanvas({ initialWidgets, dashboard, editMode }: DashboardCanvasProps) {
  const [widgets, setWidgets] = useState<IWidget[]>(initialWidgets);
  const debounceSaveRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentPositions = new Map<string, {x: number, y: number}>();
    for (const widget of widgets) {
      currentPositions.set(widget.id, widget.position);
    }
    const newWidgets = initialWidgets.map(serverWidget => {
      const localPosition = currentPositions.get(serverWidget.id);
      if (localPosition) {
        return { ...serverWidget, position: localPosition };
      } else {
        return serverWidget;
      }
    });
    setWidgets(newWidgets);
  }, [initialWidgets]);


  useEffect(() => {
    if (!editMode || widgets === initialWidgets) {
      return;
    }
    if (debounceSaveRef.current) {
      clearTimeout(debounceSaveRef.current);
    }
    debounceSaveRef.current = setTimeout(() => {
      updatePositions(dashboard.id, widgets);
    }, 1500);
    return () => {
      if (debounceSaveRef.current) {
        clearTimeout(debounceSaveRef.current);
      }
    };
  }, [widgets, dashboard.id, editMode, initialWidgets]);


  function handleDragCancel(event: DragCancelEvent) {
    document.body.classList.remove('dragging-no-scroll');
  }

  return (
    <ResizableContainer
      className='p-14 border shadow rounded relative h-[80vh] w-full'
      style={{
        backgroundImage: dashboard.schematicImagePath ? `url(${dashboard.schematicImagePath})` : 'none',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {(size) => {
        
        function handleDragEnd(event: DragEndEvent) {
          document.body.classList.remove('dragging-no-scroll');

          if (!editMode) return;
          const { active, delta } = event;
          const widgetId = active.id;

          const activeRect = active.rect.current;
          const rect = activeRect.translated ?? activeRect.initial;

          if (!rect || size.width === 0 || size.height === 0) {
            return;
          }

          const widgetWidth = rect.width;
          const widgetHeight = rect.height;

          setWidgets((currentWidgets) =>
            currentWidgets.map((w) => {
              if (w.id === widgetId) {
                const newX = w.position.x + delta.x / size.width;
                const newY = w.position.y + delta.y / size.height;

                const halfWidthPercent = (widgetWidth / 2) / size.width;
                const halfHeightPercent = (widgetHeight / 2) / size.height;

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

        return (
          <DndContext 
            onDragEnd={handleDragEnd} 
            onDragCancel={handleDragCancel}
          >
            {widgets.map((widget) => (
              <WidgetRenderer key={widget.id} widget={widget} editMode={editMode} />
            ))}
          </DndContext>
        );
      }}
    </ResizableContainer>
  );
}