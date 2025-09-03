"use client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
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
import { Label } from "@/components/ui/label";

import { useActionState, useEffect, useRef } from "react";

import { createDashboard } from "../actions";



export default function () {

  
    const formRef = useRef<HTMLFormElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);


    async function handelCreateDashboard(event: React.FormEvent) {
      event.preventDefault();
      
  
      const formData = new FormData(formRef.current!);
      const result = await createDashboard(formData);

      if(!result.success) {
        alert(result.errors.join("\n"));
        return;
      }
      
      // Close the modal on success
      closeButtonRef.current?.click();
      // Optionally, reset the form
      formRef.current?.reset();

    }
  


    return  <Dialog>
        <DialogTrigger asChild>
            <Button className="ml-auto" variant="default" size="lg">
                    <span>New Dashboard</span>
                        <FontAwesomeIcon icon={faPlus} />
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Dashboard</DialogTitle>
          <DialogDescription>
            Please provide a name for your new dashboard and upload the corresponding schematic file to get started.
          </DialogDescription>
        </DialogHeader>
          <form ref={formRef} onSubmit={handelCreateDashboard} className="w-full">
       <Input type="text" name="new-dashboard-name" placeholder="Dashboard Name" className="w-full mb-3" required />

       <Input type="file" name="new-dashboard-schematic" accept=".jpg,.jpeg,.png,.webp" className="w-full mb-4" required />
          

             <DialogFooter className="sm:justify-start mt-4">
                        
            <Button type="submit" className="w-full sm:w-auto">Submit</Button>
         
          <DialogClose asChild>
            <Button ref={closeButtonRef} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
             </form>
            
        

      </DialogContent>
    </Dialog>   
   
}