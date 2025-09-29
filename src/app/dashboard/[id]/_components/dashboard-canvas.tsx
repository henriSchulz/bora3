'use client';

import React, { useState, useEffect } from 'react';
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
}

export default function DashboardCanvas({ initialWidgets, dashboard }: DashboardCanvasProps) {
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<IWidget[]>(initialWidgets);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });


  // Keyboard shortcuts for toggling edit mode
  useKeyboardShortcuts({
    'e': () => setEditMode((prev) => !prev),
    'E': () => setEditMode((prev) => !prev),
    'Escape': () => setEditMode(false),
  });


    // Save positions when exiting edit mode 
    useEffect(() => {
        if (!editMode) {
            const hasChanges = widgets.some((w, index) => 
                w.position.x !== initialWidgets[index]?.position.x || 
                w.position.y !== initialWidgets[index]?.position.y
            );
            if (hasChanges) updatePositions(dashboard.id,widgets);
        }
    }, [editMode, widgets, dashboard.id]);



    // Event called when dropping a widget
  function handleDragEnd(event: DragEndEvent) {
    
    document.body.classList.remove('dragging-no-scroll');

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

          const halfWidthPercent = (widgetWidth / 2) / containerSize.width;
          const halfHeightPercent = (widgetHeight / 2) / containerSize.height;

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
        // Update container size state if it has changed
        if (size.width !== containerSize.width || size.height !== containerSize.height) {
            setContainerSize(size);
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