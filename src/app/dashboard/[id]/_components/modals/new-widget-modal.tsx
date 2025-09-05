"use client";

import { Dashboard } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WIDGET_MAP } from "../../../../../widgets/widgetMap";
import { useState } from "react";

export default function NewWidgetModal({
dashboard
}: {
  dashboard: Dashboard;

}) {
    const [widgetSelectValue, setWidgetSelectValue] = useState<string | undefined>(undefined);

    const widgetEntries = Object.entries(WIDGET_MAP);

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button>
                <FontAwesomeIcon icon={faPlus} />
                New Widget
            </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Widget</DialogTitle>
          <DialogDescription>
            Create a new widget for the dashboard "{dashboard.name}".
          </DialogDescription>
        </DialogHeader>

        <Select value={widgetSelectValue} onValueChange={setWidgetSelectValue}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a widget..." />
          </SelectTrigger>
          <SelectContent>
           {widgetEntries.map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.name}
              </SelectItem>
            ))}

          

            
          </SelectContent>
        </Select>
        <form className="w-full mt-4 space-y-4">
          {widgetSelectValue  ? (
            (() => {
              const FormComponent = WIDGET_MAP[widgetSelectValue as keyof typeof WIDGET_MAP].form;
              return <FormComponent />;
            })()
          ) : (
            <div className="text-sm text-gray-500">Please select a widget type to configure its properties.</div>
          )}
        </form>
        <DialogFooter className="sm:justify-start mt-4">
             <Button type="submit" form="new-widget-form" className="w-full sm:w-auto">
            Create Widget
          </Button>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full sm:w-auto">Cancel</Button>
          </DialogClose>
       
        </DialogFooter>


      </DialogContent>
    </Dialog>
  );
}
