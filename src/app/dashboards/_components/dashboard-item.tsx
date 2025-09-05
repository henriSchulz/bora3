"use client";

import { Dashboard } from "@prisma/client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

import DeleteDashboardModal from "./delete-dashboard-modal";
import RenameDashboardModal from "./rename-dashboard-modal";

export default function DashboardItem({ dashboard }: { dashboard: Dashboard }) {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);


  return (
   <div>
   
      <DeleteDashboardModal
        dashboard={dashboard}
        openState={[showDeleteModal, setShowDeleteModal]}
      />
      <RenameDashboardModal
        dashboard={dashboard}
        openState={[showRenameModal, setShowRenameModal]}
      />
    

     <ContextMenu>
    
      <ContextMenuTrigger>
        <div className=" p-2 border border-gray-300 rounded-md select-none">
          <h2 className="text-lg font-bold mb-2">{dashboard.name}</h2>
          <div className="mb-2">
            <img
              src={dashboard.schematicImagePath || "/placeholder.png"}
              alt={dashboard.name}
              className="w-full h-auto"
            />
          </div>

          <div className="text-sm text-gray-600">
            Created at: {new Date(dashboard.createdAt).toLocaleDateString()}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => window.open(`/dashboard/${dashboard.id}`, "_blank")}>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          Open Dashboard
        </ContextMenuItem>
        <ContextMenuItem onClick={() => setShowRenameModal(true)}>
          <FontAwesomeIcon icon={faPencil} />
          Rename Dashboard
        </ContextMenuItem>
        <ContextMenuItem variant="destructive" onClick={() => setShowDeleteModal(true)}> 
          <FontAwesomeIcon icon={faTrash} />
          Delete Dashboard
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
   </div>
  );
}
