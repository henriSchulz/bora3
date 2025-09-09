"use client";

import { FC, CSSProperties, useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { widgetRegistry, IWidget } from "@/widgets/core/autogen.client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

import DeleteWidgetModal from "./modals/delete-widget-modal";
import { ITextWidget } from "@/types/widgets";

export default function WidgetRenderer({
  widget,
  editMode,
}: {
  widget: IWidget;
  editMode: boolean;
}) {

  const boraWidget = widgetRegistry[widget.type];
  if(!boraWidget) {
    throw new Error(`No widget found for type: ${widget.type}`);
  }

  const Component = boraWidget.render();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: widget.id,
    disabled: !editMode,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const style: CSSProperties = {
    position: "absolute",
    left: `${widget.position.x * 100}%`,
    top: `${widget.position.y * 100}%`,
    width: widget.width,
    height: widget.height,
    cursor: editMode ? "move" : "default",
    transform: "translate(-50%, -50%)",
  // Verhindere Layout-Shift beim Ein-/Ausschalten des Edit-Modus:
  // 1. Immer gleich breite (1px) Border reservieren -> wenn nicht EditMode transparent
  // 2. boxSizing border-box, damit die Border nicht das visuelle Zentrum verschiebt
  boxSizing: "border-box",
  border: "1px dashed",
  borderColor: editMode ? "gray" : "transparent",
  };

  if (transform) {
    //  change transform if dragging to fix jump issue
    const dragTransform = `translate3d(${transform.x}px, ${transform.y}px, 0)`;
    style.transform = `${style.transform} ${dragTransform}`;
    style.zIndex = 10;
  }


  const element = (
    <div
      ref={setNodeRef}
      style={style}
      {...(mounted ? listeners : {})}
      {...(mounted ? attributes : {})}
    >
      <Component widget={widget as never} />
    </div>
  );

  return (
    <div>
      <DeleteWidgetModal
        widget={widget}
        openState={[showDeleteModal, setShowDeleteModal]}
      />

      <ContextMenu>
        {editMode ? (
          <ContextMenuTrigger>{element}</ContextMenuTrigger>
        ) : (
          element
        )}

        <ContextMenuContent>
          <ContextMenuItem
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete Widget
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
