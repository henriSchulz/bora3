import { ITextWidget } from "@/types/widgets";
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
import { z } from "zod";
import { FC } from "react";
import { registerWidget } from "@/lib/decorators";
import { WidgetType } from "./core/autogen";
import { Widget as PrismaWidget } from "@prisma/client";

@registerWidget("Text")
export class TextWidget extends BoraWidget<ITextWidget> {
  public constructor() {
    const textWidgetSchema = z.object({
      textContent: z.string(
        "Text content must be a string"
      ).min(1, "Text content is required"),
      fontSize: z
        .number("Font size must be a number")
        .min(1, "Font size must be at least 1")
        .optional()
        .default(14),
      fontWeight: z.enum(["normal", "bold"]).optional().default("normal"),
      backgroundColor: z.string().optional().default("transparent"),
      defaultTextColor: z.string().optional().default("black"),
      width: z.number(
        "Width must be a number"
      )
      .min(10, "Width must be at least 10")
      .optional().default(100),
      height: z.number(
        "Height must be a number"
      )
      .min(10, "Height must be at least 10")
      .default(50).optional(),
    });
    super(textWidgetSchema);
  }

  public render(): FC<{ widget: ITextWidget }> {
    return TextWidgetComponent;
  }

  public renderForm(): FC<{ widget?: ITextWidget }> {
    return TextWidgetForm;
  }

}

export function TextWidgetForm({ widget }: { widget?: ITextWidget }) {
  const isEditMode = !!widget;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="textContent" className="mb-2 block text-sm font-medium">
          Text Content
        </Label>
        <Input
          id="textContent"
          type="text"
          name="textContent"
          defaultValue={widget?.textContent || ""}
          placeholder="Enter text content"
          className="w-full"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="fontSize" className="mb-2 block text-sm font-medium">
            Font Size (px)
          </Label>
          <Input
            id="fontSize"
            type="number"
            name="fontSize"
            defaultValue={widget?.fontSize || 16}
            placeholder="Enter font size"
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Label
            htmlFor="fontWeight"
            className="mb-2 block text-sm font-medium"
          >
            Font Weight
          </Label>
          <Select
            name="fontWeight"
            defaultValue={widget?.fontWeight || "normal"}
          >
            <SelectTrigger id="fontWeight" className="w-full">
              <SelectValue placeholder="Select font weight" />
            </SelectTrigger>
            <SelectContent>
              {["normal", "bold"].map((weight) => (
                <SelectItem key={weight} value={weight}>
                  {weight.charAt(0).toUpperCase() + weight.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label
            htmlFor="backgroundColor"
            className="mb-2 block text-sm font-medium"
          >
            Background Color
          </Label>
          <Input
            name="backgroundColor"
            id="backgroundColor"
            type="color"
            defaultValue={widget?.backgroundColor || "#ffffff"}
            className="w-full h-10 p-0 border-0"
          />
        </div>
        <div className="flex-1">
          <Label
            htmlFor="defaultTextColor"
            className="mb-2 block text-sm font-medium"
          >
            Default Text Color
          </Label>
          <Input
            name="defaultTextColor"
            id="defaultTextColor"
            type="color"
            defaultValue={widget?.defaultTextColor || "#000000"}
            className="w-full h-10 p-0 border-0"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="boxWidth" className="mb-2 block text-sm font-medium">
            Box Width (px)
          </Label>
          <Input
            name="width"
            id="boxWidth"
            type="number"
            defaultValue={widget?.width || 200}
            placeholder="Enter box width"
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="boxHeight" className="mb-2 block text-sm font-medium">
            Box Height (px)
          </Label>
          <Input
            name="height"
            id="boxHeight"
            type="number"
            defaultValue={widget?.height || 100}
            placeholder="Enter box height"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export function TextWidgetComponent({ widget }: { widget: ITextWidget }) {
  const {
    textContent,
    fontSize = 16,
    fontWeight = "normal",
    backgroundColor = "transparent",
    defaultTextColor = "black",
  } = widget;

  const containerStyle = {
    backgroundColor,
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  };

  const textStyle = {
    color: defaultTextColor,
    fontSize: `${fontSize}px`,
    fontWeight,
  };

  return (
    <div style={containerStyle}>
      <span style={textStyle}>{textContent}</span>
    </div>
  );
}
