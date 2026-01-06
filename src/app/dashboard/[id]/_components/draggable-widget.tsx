'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { IWidget } from '@/widgets/core/autogen.types';

interface DraggableWidgetProps {
  widget: IWidget;
  editMode: boolean;
  children: ReactNode;
}

export default function DraggableWidget({ widget, editMode, children }: DraggableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: widget.id,
    disabled: !editMode,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const style: CSSProperties = {
    position: 'absolute',
    left: `${widget.position.x * 100}%`,
    top: `${widget.position.y * 100}%`,
    width: widget.width ?? undefined,
    height: widget.height ?? undefined,
    cursor: editMode ? 'move' : 'default',
    transform: 'translate(-50%, -50%)',
    overflow: 'hidden',
    wordBreak: 'break-word',
    boxSizing: 'border-box',
    border: '1px dashed',
    borderColor: editMode ? 'gray' : 'transparent',
  };

  if (transform) {
    const dragTransform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    style.transform = `${style.transform} ${dragTransform}`;
    style.zIndex = 10;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(mounted ? listeners : {})}
      {...(mounted ? attributes : {})}
    >
      {children}
    </div>
  );
}