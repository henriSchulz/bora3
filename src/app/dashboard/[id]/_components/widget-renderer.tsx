"use client";

import { FC, useState } from "react";
import { IWidget } from "@/widgets/core/autogen.types";
import { widgetUIRegistry } from "@/widgets/core/autogen.ui";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DeleteWidgetModal from "./modals/delete-widget-modal";
import DraggableWidget from "./draggable-widget";

export default function WidgetRenderer({
  widget,
  editMode,
}: {
  widget: IWidget;
  editMode: boolean;
}) {
  const uiWidget = widgetUIRegistry[widget.type];
  if (!uiWidget) {
    throw new Error(`No widget found for type: ${widget.type}`);
  }

  const Component = uiWidget.component as FC<{ widget: IWidget }>;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const element = (
    <DraggableWidget widget={widget} editMode={editMode}>
      <Component widget={widget as never} />
    </DraggableWidget>
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
