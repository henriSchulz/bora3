import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { ITextWidget } from "@/types/widgets";

export function TextWidgetForm({ widget }: { widget?: ITextWidget }) {
  const isEditMode = !!widget;

  const [textContent, setTextContent] = useState(widget?.textContent || "");
  const [fontSize, setFontSize] = useState(widget?.fontSize || 16);
  const [fontWeight, setFontWeight] = useState(widget?.fontWeight || "normal");
  const [backgroundColor, setBackgroundColor] = useState(
    widget?.backgroundColor || "transparent"
  );
  const [defaultTextColor, setDefaultTextColor] = useState(
    widget?.defaultTextColor || "#000000"
  );
  const [width, setWidth] = useState(widget?.width ?? "");
  const [height, setHeight] = useState(widget?.height ?? "");

  return (
    <div className="space-y-4 overflow-hidden">
      <div>
        <Label htmlFor="textContent" className="mb-2 block text-sm font-medium">
          Text Content
        </Label>
        <Input
          required
          id="textContent"
          type="text"
          name="textContent"
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
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
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
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
            value={fontWeight}
            onValueChange={(value) => setFontWeight(value as "normal" | "bold")}
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
            // type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
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
            value={defaultTextColor}
            onChange={(e) => setDefaultTextColor(e.target.value)}
            className="w-full h-10 p-0 border-0"
          />
        </div>
      </div>
      <div className="flex gap-4 mb-2 items-end">
        <div className="flex-1">
          <Label htmlFor="boxWidth" className="block text-sm font-medium">
            Box Width (px)
          </Label>
          <Input
            name="width"
            id="boxWidth"
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="Auto"
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="boxHeight" className="block text-sm font-medium">
            Box Height (px)
          </Label>
          <Input
            name="height"
            id="boxHeight"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Auto"
            className="w-full"
          />
        </div>
      </div>
      <hr />
      <div className="flex justify-center w-full m-4">
        <div
          className="border p-2 flex items-center justify-center"
          style={{
            width: width ? `${width}px` : "auto",
            height: height ? `${height}px` : "auto",
            backgroundColor,
          }}
        >
          <span
            style={{
              color: defaultTextColor,
              fontSize: `${fontSize}px`,
              fontWeight,
            }}
          >
            {textContent || "Preview Text"}
          </span>
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
