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

  // src/app/dashboard/[id]/_components/modals/edit-widget-modal.tsx

  // src/app/dashboard/[id]/_components/modals/edit-widget-modal.tsx

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const result = await updateWidget(widget, formData);

    if (result.success) {
      // 1. Schließe das Modal
      openState[1](false);
      
      // 2. Fordere den Server auf, die Daten neu zu laden und an den Client zu senden.
      // Dies löst den useEffect in Schritt 2 aus.
      router.refresh(); 

      // (Optional) Erfolgsmeldung, wenn gewünscht
      // alert("Widget updated successfully.");

    } else {
      // Nur bei Fehler Modal offen lassen und Fehler anzeigen
      alert("Failed to update widget: " + result.errors.join(", "));
    }
  }

   


    return (
    <Dialog open={openState[0]} onOpenChange={openState[1]}>
      <DialogContent>
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