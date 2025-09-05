'use client';

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, DragCancelEvent } from '@dnd-kit/core';
import WidgetRenderer from './WidgetRenderer';
import { Widget } from '@/types/widgets';
import { Dashboard } from '@prisma/client';
import { updatePositions } from '../actions';

interface DashboardCanvasProps {
  initialWidgets: Widget[];
  dashboard: Dashboard;
}

export default function DashboardCanvas({ initialWidgets, dashboard }: DashboardCanvasProps) {
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Get container size on mount
  useLayoutEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerSize({ width: clientWidth, height: clientHeight });
    }
  }, []);


  // keyboard shortcuts for toggling edit mode E or Escape to exit
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        const isTypingTarget = !!target && (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable
        );
        if (isTypingTarget) return;

        if (e.key === 'e' || e.key === 'E') {
            setEditMode((prev) => !prev);
        } else if (e.key === 'Escape') {
            setEditMode(false);
        } 
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
}, [editMode]);


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
    <div
      style={{
        backgroundImage: dashboard.schematicImagePath ? `url(${dashboard.schematicImagePath})` : 'none',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      ref={containerRef}
      className='p-14 border shadow rounded relative h-[80vh] w-full'
    >
      
      <DndContext 
        onDragEnd={handleDragEnd} 
        onDragCancel={handleDragCancel}
      >
        {widgets.map((widget) => (
          <WidgetRenderer key={widget.id} widget={widget} editMode={editMode} />
        ))}
      </DndContext>
    </div>
  );
  
}