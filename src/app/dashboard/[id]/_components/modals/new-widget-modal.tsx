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

import { WidgetType } from "@/widgets/core/autogen.types";
import { widgetUIRegistry } from "@/widgets/core/autogen.ui";
import { widgetLogicRegistry } from "@/widgets/core/autogen.logic";
import { useState } from "react";
import { createWidget } from "../../actions";

export default function NewWidgetModal({
  dashboard,
}: {
  dashboard: Dashboard;
}) {
  const [widgetSelectValue, setWidgetSelectValue] = useState<string>();

  const widgetNames = Object.keys(widgetLogicRegistry);

  const boraWidget = widgetSelectValue
    ? widgetLogicRegistry[widgetSelectValue as WidgetType]
    : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const widgetType = widgetSelectValue as WidgetType;

    if (!widgetType || !boraWidget) {
      alert("Please select a widget type.");
      return;
    }

    

    const { errors } = await createWidget(dashboard.id, widgetType, formData);

    if (errors.length > 0) {
      return alert("Failed to create widget: " + errors.join(", "));
    }

    window.location.reload();

   
  };

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
            {widgetNames.map((name, idx) => (
              <SelectItem key={idx} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
          {widgetSelectValue ? (
            (() => {
              if (!boraWidget) {
                return (
                  <div className="text-sm text-red-500">
                    Bora widget "{widgetSelectValue}" does not have a
                    configuration form.
                  </div>
                );
              } else {
                const FormComponent =
                  widgetUIRegistry[widgetSelectValue as WidgetType]!.form;
                return <FormComponent />;
              }
            })()
          ) : (
            <div className="text-sm text-gray-500">
              Please select a widget type to configure its properties.
            </div>
          )}
          <DialogFooter className="sm:justify-start mt-4">
            <Button type="submit" className="w-full sm:w-auto">
              Create Widget
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
