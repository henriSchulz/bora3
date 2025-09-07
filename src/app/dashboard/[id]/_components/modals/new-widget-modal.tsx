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
import { IWidget, widgetRegistry, WidgetType } from "@/widgets/core/autogen";
import { useState } from "react";

export default function NewWidgetModal({
  dashboard,
}: {
  dashboard: Dashboard;
}) {
  const [widgetSelectValue, setWidgetSelectValue] = useState<string>();

  const widgetNames = Object.keys(widgetRegistry);

  const boraWidget = widgetSelectValue
    ? widgetRegistry[widgetSelectValue as WidgetType]
    : null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const widgetType = widgetSelectValue as WidgetType;
    if (!widgetType || !boraWidget) {
      alert("Please select a widget type.");
      return;
    }

    const processFormData = boraWidget.parseForm(dashboard.id, formData);

    alert("Widget created with data: " + JSON.stringify(processFormData));
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
                const FormComponent = boraWidget.renderForm();
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
