"use client";

import { Dashboard } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { deleteDashboard } from "../actions";

export default function DeleteDashboardModal({
  dashboard,
  openState,
}: {
  dashboard: Dashboard;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  
  async function handleDelete(event: React.FormEvent) {
    event.preventDefault();
    const result = await deleteDashboard(dashboard.id);
    if (!result.success) {
      alert(result.errors.join("\n"));
    } else {
      openState[1](false);
    }
  }

  return (
    <Dialog open={openState[0]} onOpenChange={openState[1]}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {dashboard.name}?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this dashboard? All associated
            widgets and data will be permanently removed. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start mt-4">
          <form onSubmit={handleDelete}>
            <Button variant="destructive" className="w-full sm:w-auto">
              <FontAwesomeIcon icon={faTrash} />
              Delete
            </Button>
          </form>
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
