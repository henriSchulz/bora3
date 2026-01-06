
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

import 'katex/dist/katex.min.css';
import katex from 'katex';

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

    display: "flex",
    flexDirection: "row", // Changed to row
    justifyContent: "center",
    alignItems: "center", // Center vertically
    gap: "8px", // Add spacing
    width: widget.width ? `${widget.width}px` : "auto",
    height: widget.height ? `${widget.height}px` : "auto",
  } as React.CSSProperties;

  const textStyle = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontWeight,
  };

  // Construct LaTeX string
  // We wrap textContent in \text{} if it exists
  // We render the value as is (it's a number string)
  // We render unit as LaTeX (assuming user inputs LaTeX for unit, or simple text which works too)
  const latexString = `
    ${textContent ? `\\text{${textContent}}` : ''}
    \\quad
    ${formattedValue}
    \\quad
    ${unit ? `\\text{${unit}}` : ''} 
  `;
  
  // Better approach: Render parts individually or construct a single math expression?
  // User request: "expressions latex used... unit... numbers also latex rendered"
  // So we should treat the whole thing as a math expression or separate parts.
  // Let's try to render them as a single block for alignment, but maybe separate lines if it gets too long?
  // Actually, the previous design had them side-by-side or stacked?
  // The previous design was:
  // {textContent} (smaller)
  // {formattedValue} {unit}
  
  // Let's replicate that structure but with LaTeX rendering.
  
  const renderLatex = (latex: string, fontSizePx: number) => {
      try {
          const html = katex.renderToString(latex, {
              throwOnError: false,
              displayMode: false, // Inline mode
          });
          return <span style={{ fontSize: `${fontSizePx}px`, color: textColor, fontWeight }} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
          return <span>{latex}</span>;
      }
  };

  return (
    <div style={containerStyle}>
      {textContent && (
         <div>
            {renderLatex(`\\text{${textContent}}`, fontSize * 0.8)}
         </div>
      )}
      <div>
        {renderLatex(`${formattedValue} \\; ${unit || ''}`, fontSize)}
      </div>
    </div>
  );
}

export function ValueWidgetForm({ widget }: { widget?: IValueWidget }) {
  const isEditMode = !!widget;

  const [currentStep, setCurrentStep] = useState(0);

  const [dataId, setDataId] = useState(
    (widget?.dataSource?.type === "database" ? widget.dataSource.dataId : "") || ""
  );

  // --- NEUE STATES HINZUFÜGEN ---
  const [dataSourceType, setDataSourceType] = useState<"database" | "calculation">(
    widget?.dataSource?.type || "database"
  );
  const [expression, setExpression] = useState(
    (widget?.dataSource?.type === "calculation" ? widget.dataSource.expression : "") || ""
  );
  const [dataIdsString, setDataIdsString] = useState(
    (widget?.dataSource?.type === "calculation" ? widget.dataSource.dataIds.join(", ") : "") || ""
  );

  const [textContent, setTextContent] = useState(widget?.textContent || "");
  const [unit, setUnit] = useState(widget?.unit || "");
  const [decimalPlaces, setDecimalPlaces] = useState(
    widget?.decimalPlaces ?? 2
  );
  const [fontSize, setFontSize] = useState(widget?.fontSize ?? 16);
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">(
    widget?.fontWeight || "normal"
  );
  const [backgroundColor, setBackgroundColor] = useState(
    widget?.backgroundColor || "transparent"
  );
  const [defaultTextColor, setDefaultTextColor] = useState(
    widget?.defaultTextColor || "black"
  );
  const [width, setWidth] = useState(widget?.width ?? "");
  const [height, setHeight] = useState(widget?.height ?? "");
  const [conditions, setConditions] = useState<ConditionalRule<ColorFormat>[]>(
    widget?.conditions || []
  );

  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isExpressionFocused, setIsExpressionFocused] = useState(false);

  const previewValue = 123.456;

  const steps = [
    { title: "Data Source", description: "Configure data input" },
    { title: "Display", description: "Label and formatting" },
    { title: "Styling", description: "Colors and fonts" },
    { title: "Advanced", description: "Dimensions and rules" },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderLatex = (latex: string, fontSizePx: number, color: string = "#000000", fontWeight: string = "normal") => {
      try {
          const html = katex.renderToString(latex, {
              throwOnError: false,
              displayMode: false, // Inline mode
          });
          return <span style={{ fontSize: `${fontSizePx}px`, color, fontWeight }} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
          return <span style={{ fontSize: `${fontSizePx}px`, color, fontWeight }}>{latex}</span>;
      }
  };

  return (
    <div className="space-y-4">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index === currentStep
                    ? "bg-primary text-primary-foreground"
                    : index < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              <div className="text-xs mt-1 text-center font-medium">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 mx-2 transition-colors ${
                  index < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div>
        {/* Step 0: Data Source */}
        {currentStep === 0 && (
          <div className="space-y-3 p-4 rounded-md border bg-gray-50 dark:bg-input/30">
            <Label htmlFor="dataSourceType" className="mb-1 block text-sm font-medium">
              Data Source Type
            </Label>
            <Select
              name="dataSourceType"
              value={dataSourceType}
              onValueChange={(value) =>
                setDataSourceType(value as "database" | "calculation")
              }
            >
              <SelectTrigger id="dataSourceType" className="w-full">
                <SelectValue placeholder="Select data source type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="database">Single ID</SelectItem>
                <SelectItem value="calculation">Calculation (Expression)</SelectItem>
              </SelectContent>
            </Select>

            {dataSourceType === "database" && (
              <div className="space-y-1">
                <Label htmlFor="dataId" className="mb-1 block text-sm font-medium">
                  Data Source ID
                </Label>
                <Input
                  id="dataId"
                  type="text"
                  name="dataId"
                  value={dataId}
                  onChange={(e) => setDataId(e.target.value)}
                  placeholder="z.B. sensor_temp_1"
                  className="w-full"
                />
              </div>
            )}

            {dataSourceType === "calculation" && (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="expression" className="mb-1 block text-sm font-medium">
                    Expression
                  </Label>
                  {isExpressionFocused ? (
                      <Input
                        id="expression"
                        type="text"
                        name="expression"
                        value={expression}
                        autoFocus
                        onBlur={() => setIsExpressionFocused(false)}
                        onChange={(e) => {
                          const newExpr = e.target.value;
                          setExpression(newExpr);
                          const variables = Array.from(newExpr.matchAll(/[a-zA-Z_][a-zA-Z0-9_]*/g))
                            .map(m => m[0])
                            .filter(v => !['sin', 'cos', 'tan', 'sqrt', 'log', 'exp', 'pi', 'e', 'abs', 'min', 'max'].includes(v)); // Basic exclusion

                          const uniqueVars = Array.from(new Set(variables));
                          setDataIdsString(uniqueVars.join(", "));
                        }}
                        placeholder="e.g. (temp1 + temp2) / 2"
                        className="w-full"
                      />
                  ) : (
                      <div
                          className="w-full min-h-[40px] p-2 border rounded-md bg-white dark:bg-background cursor-text flex items-center"
                          onClick={() => setIsExpressionFocused(true)}
                      >
                          {expression ? renderLatex(expression, 16) : <span className="text-muted-foreground">Click to edit expression...</span>}
                      </div>
                  )}
                  {/* Hidden input to ensure value is submitted even when not focused/editing */}
                  {!isExpressionFocused && <input type="hidden" name="expression" value={expression} />}
                  <p className="text-xs text-muted-foreground mt-1">
                      Supports LaTeX syntax (e.g., \epsilon_0, \pi, \sqrt{"{x}"}) and physical constants.
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="dataIdsString"
                    className="mb-1 block text-sm font-medium"
                  >
                    Detected Data IDs
                  </Label>
                  <Input
                    id="dataIdsString"
                    type="text"
                    value={dataIdsString}
                    readOnly
                    className="w-full bg-gray-100 text-gray-500"
                  />
                  <input
                    type="hidden"
                    name="dataIds"
                    value={JSON.stringify(
                      dataIdsString
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Display */}
        {currentStep === 1 && (
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

            <div>
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
          </div>
        )}

        {/* Step 2: Styling */}
        {currentStep === 2 && (
          <div className="space-y-4">
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
                  onChange={(e) => {
                      const val = Number(e.target.value);
                      setFontSize(val > 50 ? 50 : val);
                  }}
                  placeholder="Enter font size"
                  className="w-full"
                  max="50"
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
              //    type="color"
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
          </div>
        )}

        {/* Step 3: Advanced */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex gap-4">
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

            <div className="flex justify-between items-center pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsConditionsModalOpen(true)}>
                  Conditional Formatting
              </Button>
              <div className="text-xs text-muted-foreground">
                  {conditions.length} rule(s) active
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4 border rounded-md bg-gray-50/50 dark:bg-gray-900/50 max-h-[200px] overflow-auto w-full max-w-full">
        <div className="min-w-full min-h-full flex items-center justify-center p-4">
          <div
            className="border p-2 flex flex-row items-center justify-center gap-2 bg-white dark:bg-black shadow-sm overflow-hidden shrink-0"
            style={{
              width: width ? `${width}px` : "auto",
              height: height ? `${height}px` : "auto",
              backgroundColor,
            }}
          >
            {textContent && (
               <div>
                  {renderLatex(`\\text{${textContent}}`, fontSize * 0.8, defaultTextColor, fontWeight)}
               </div>
            )}
            <div>
              {renderLatex(`${previewValue.toFixed(decimalPlaces)} \\; ${unit || ''}`, fontSize, defaultTextColor, fontWeight)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
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
      <input type="hidden" name="conditions" value={JSON.stringify(conditions)} />
    </div>
  );
}
