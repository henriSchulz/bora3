"use client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { deleteWidget } from "../../actions";
import { Widget } from "@/types/widgets";



export default function DeleteDashboardModal({
  widget,
  openState,
}: {
  widget: Widget;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  
  async function handleDelete(event: React.FormEvent) {
    event.preventDefault();
    const result = await deleteWidget(widget.id);
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
          <DialogTitle>Delete {widget.type} Widget?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this widget? This action cannot be undone.
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
