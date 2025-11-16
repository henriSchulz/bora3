
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  IValueWidget,
  ConditionalRule,
  ColorFormat,
} from "@/types/widgets";
import { ValueWidget } from "./widget";
import { ConditionsModal } from "./ConditionsModal";

export function ValueWidgetComponent({ widget }: { widget: IValueWidget }) {
  const {
    value,
    textContent,
    unit,
    decimalPlaces = 2,
    fontSize = 16,
    fontWeight = "normal",
    backgroundColor = "transparent",
    defaultTextColor = "black",
    conditions,
  } = widget;

  let textColor = defaultTextColor;
  if (conditions && typeof value === "number") {
    for (const rule of conditions) {
      if (ValueWidget.evaluateCondition(value, rule.condition, rule.value)) {
        textColor = rule.format.color;
        break;
      }
    }
  }

  // Format the value
  const formattedValue =
    typeof value === "number" ? value.toFixed(decimalPlaces) : "N/A";

  const containerStyle = {
    backgroundColor,
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
  };

  const textStyle = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontWeight,
  };

  return (
    <div>
      {textContent && (
        <span style={{ ...textStyle, fontSize: `${fontSize * 0.8}px` }}>
          {textContent}
        </span>
      )}
      <span style={textStyle}>
        {formattedValue} &nbsp;{unit}
      </span>
    </div>
  );
}

export function ValueWidgetForm({ widget }: { widget?: IValueWidget }) {
  const isEditMode = !!widget;

  const [textContent, setTextContent] = useState(widget?.textContent || "");
  const [unit, setUnit] = useState(widget?.unit || "");
  const [decimalPlaces, setDecimalPlaces] = useState(
    widget?.decimalPlaces || 2
  );
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
  const [conditions, setConditions] = useState<ConditionalRule<ColorFormat>[]>(
    widget?.conditions || []
  );

  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);

  const previewValue = 123.456;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label
            htmlFor="textContent"
            className="mb-2 block text-sm font-medium"
          >
            Label Text
          </Label>
          <Input
            id="textContent"
            type="text"
            name="textContent"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Enter a label"
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="unit" className="mb-2 block text-sm font-medium">
            Unit
          </Label>
          <Input
            id="unit"
            type="text"
            name="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g. °C, %"
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Label
            htmlFor="decimalPlaces"
            className="mb-2 block text-sm font-medium"
          >
            Decimal Places
          </Label>
          <Input
            id="decimalPlaces"
            type="number"
            name="decimalPlaces"
            value={decimalPlaces}
            onChange={(e) => setDecimalPlaces(Number(e.target.value))}
            placeholder="Enter decimal places"
            className="w-full"
            min="0"
          />
        </div>
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
            onValueChange={setFontWeight}
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

      <Button onClick={() => setIsConditionsModalOpen(true)}>
        Edit Conditions
      </Button>

      <hr />
      <div className="flex justify-center w-full m-4">
        <div
          className="border p-2 flex flex-col items-center justify-center"
          style={{
            width: width ? `${width}px` : "auto",
            height: height ? `${height}px` : "auto",
            backgroundColor,
          }}
        >
          {textContent && (
            <span
              style={{
                color: defaultTextColor,
                fontSize: `${fontSize * 0.8}px`,
                fontWeight,
              }}
            >
              {textContent}
            </span>
          )}
          <span
            style={{
              color: defaultTextColor,
              fontSize: `${fontSize}px`,
              fontWeight,
            }}
          >
            {previewValue.toFixed(decimalPlaces)} {unit}
          </span>
        </div>
      </div>
      <ConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
        conditions={conditions}
        onSave={(newConditions) => {
          setConditions(newConditions);
          setIsConditionsModalOpen(false);
        }}
      />
    </div>
  );
}
