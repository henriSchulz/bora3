import { Dashboard } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
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

import { Input } from "@/components/ui/input";

import { useRef } from "react";

import { renameDashboard } from "../actions";

export default function RenameDashboardModal({
  dashboard,
  openState,
}: {
  dashboard: Dashboard;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  const [isOpen, setIsOpen] = openState;

  async function handleRename(event: React.FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const newName = formData.get("rename-dashboard-name") as string;

    if(newName === dashboard.name) {
      setIsOpen(false);
      return;
    }

    // Call the renameDashboard action
    const result = await renameDashboard(dashboard.id, newName);

    if (!result.success) {
      alert(result.errors.join("\n"));
      return;
    }

    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Dashboard</DialogTitle>
          <DialogDescription>
            Enter a new name for the dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleRename} className="space-y-4">
          <div>
            <Input
              type="text"
              name="rename-dashboard-name"
              defaultValue={dashboard.name}
              placeholder="Dashboard Name"
              required
              className="w-full"
              autoFocus
            />
          </div>
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-start sm:space-x-2">
         
            <Button type="submit">
              <FontAwesomeIcon icon={faPencil} className="mr-2" />
              Rename
            </Button>
               <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
