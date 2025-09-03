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

import { createDashboard, type FormState } from "../actions";



export default function () {


    const initialState: FormState = { message: "", errors: {} };
  
    // 2. Use the useFormState hook to manage form state and actions
    const [state, formAction] = useActionState(createDashboard, initialState);
    
    const formRef = useRef<HTMLFormElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Close dialog and reset form on successful submission
    useEffect(() => {
      if (state.message === "Dashboard created successfully!") {
        formRef.current?.reset();
        closeButtonRef.current?.click();
      }
    }, [state.message]);


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
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
           
            <form ref={formRef} action={formAction}>

            <div className="mb-2">
                 <Label htmlFor="new-dashboard-name" className="mb-1"> Dashboard Name</Label>
                <Input 
                  id="new-dashboard-name" 
                  name="new-dashboard-name"
                  placeholder="e. g. My Dashboard" 
                />
                {state.errors?.dashboardName && (
                    <p className="text-sm text-red-500 mt-1">
                        {state.errors.dashboardName[0]}
                    </p>
                )}
            </div>

           <div>
             <Label htmlFor="new-dashboard-schematic" className="mb-1">Schematic</Label>
             <Input 
               id="new-dashboard-schematic" 
               name="new-dashboard-schematic"
               type="file" 
             />
             {state.errors?.file && (
          <p className="text-sm text-red-500 mt-1">
            {state.errors.file[0]}
          </p>
        )}
           </div>

           {/* Success message display */}
           {state.message && !state.errors?.dashboardName && !state.errors?.file && (
             <div className="text-sm text-green-600 mt-2">
               {state.message}
             </div>
           )}

           {/* General error message */}
           {state.message && (state.errors?.dashboardName || state.errors?.file) && (
             <div className="text-sm text-red-500 mt-2">
               {state.message}
             </div>
           )}
             <DialogFooter className="sm:justify-start">
            <Button type="submit" className="w-full sm:w-auto">Submit</Button>


          <DialogClose asChild>
            <Button ref={closeButtonRef} type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
            </form>
            
          </div>
        </div>
       
      </DialogContent>
    </Dialog>   
   
}