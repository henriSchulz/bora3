import { IIconWidget } from "@/types/widgets";
import { z } from "zod";
import { Condition } from "@/types/widgets";
import { BoraWidget } from "./core/bora-widget";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Widget as PrismaWidget } from "@prisma/client";
import { FC } from "react";
import { registerWidget } from "@/lib/decorators";

@registerWidget("Icon")
export class IconWidget extends BoraWidget<IIconWidget> {
  public constructor() {
    const iconWidgetSchema = z.object({
      dataId: z.string().optional(),
      expression: z.string().optional(),
      dataIds: z.array(z.string()).optional(),
      value: z.number().optional(),
      defaultIcon: z.string().optional(),
      conditions: z
        .array(
          z.object({
            condition: z.enum(Object.values(Condition)),

            value: z.union([z.number(), z.array(z.number())]),
            format: z.object({
              icon: z.string(),
            }),
          })
        )
        .optional(),
    });
    super(iconWidgetSchema);
  }

  public render(): FC<{ widget: IIconWidget }> {
    return IconWidgetComponent;
  }

  public renderForm(): FC<{ widget?: IIconWidget }> {
    return IconWidgetForm;
  }

  public parseForm(dashboardId: string,formData: FormData): {widget?: Omit<PrismaWidget, "id" | "createAt" | "updatedAt">, error?: string} {
    return {error: "Not implemented yet"};
  }

  

}

export function IconWidgetComponent({ widget }: { widget: IIconWidget }) {
  return <div>Icon Widget</div>;
}

export function IconWidgetForm({ widget }: { widget?: IIconWidget }) {
  const isEditMode = !!widget;

  return <div>Icon Widget Form</div>;
}
