"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IWidget, WidgetType } from "@/widgets/core/autogen.types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { widgetUIRegistry } from "@/widgets/core/autogen.ui";
import { updateWidget } from "../../actions";
import { tr } from "zod/v4/locales";



export default function EditWidgetModal({
    widget,
    openState,

}: {
    widget: IWidget;
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();


        const formData = new FormData(e.currentTarget);

       
         const result = await updateWidget(
          widget, formData
        );
          openState[1](false);
          // refresh the current route so server components re-fetch updated data
          router.refresh();
        if (!result.success) {
          alert("Failed to update widget: " + result.errors.join(", "));
        } else {
          openState[1](false);
          alert("Widget updated successfully.");
          
          window.location.reload();
        }

   }

   


    return (
    <Dialog open={openState[0]} onOpenChange={openState[1]}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Widget</DialogTitle>
          <DialogDescription>
            Modify the properties of your widget below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
          
        {widget.type ? (() => {
            const FormComponent =
                     widgetUIRegistry[widget.type]!.form;

            if(!FormComponent) {
                return <p>No editable properties for "{widget.type}" widget.</p>;
            }

            return <FormComponent widget={widget} />;
        })() : null}

          <DialogFooter className="sm:justify-start mt-4">
            <Button type="submit" className="w-full sm:w-auto">
              Save Changes
            </Button>
            <DialogClose asChild>
              <Button variant="secondary" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );



}