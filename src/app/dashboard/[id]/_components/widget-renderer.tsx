'use client';

import { FC, CSSProperties, useEffect, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {Widget} from '@/types/widgets';
import { WIDGET_MAP } from '../../../../widgets/widgetMap';


import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import DeleteWidgetModal from './modals/delete-widget-modal';



export default function WidgetRenderer({ widget, editMode }: { widget: Widget; editMode: boolean }) {
  const Component = WIDGET_MAP[widget.type as keyof typeof WIDGET_MAP]?.component as FC<{ widget: Widget }>;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
  id: widget.id,
  disabled: !editMode,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

  const style: CSSProperties = {
        position: 'absolute',
        left: `${widget.position.x * 100}%`,
        top: `${widget.position.y * 100}%`,
        width: widget.width,
        height: widget.height,
  cursor: editMode ? 'move' : 'default',
        transform: 'translate(-50%, -50%)', 
        border: editMode ? '2px dashed gray' : 'none',
    };


    if (transform) {
        //  change transform if dragging to fix jump issue
        const dragTransform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
        style.transform = `${style.transform} ${dragTransform}`;
        style.zIndex = 10;
    }

    const element = ( <div 
            ref={setNodeRef}
            style={style}
              {...(mounted ? listeners : {})}
              {...(mounted ? attributes : {})}
            >
              <Component widget={widget} />
    </div>);

    return (
      <div>
        <DeleteWidgetModal
          widget={widget}
          openState={[showDeleteModal, setShowDeleteModal]}
        />
         

        <ContextMenu>

          {editMode ? <ContextMenuTrigger>
            {element}
          </ContextMenuTrigger> : element}

          <ContextMenuContent>

             <ContextMenuItem variant="destructive" onClick={() => setShowDeleteModal(true)}> 
          <FontAwesomeIcon icon={faTrash} />
          Delete Dashboard
        </ContextMenuItem>
          </ContextMenuContent>
          
          
    
       
        </ContextMenu>
        </div>
    );
}