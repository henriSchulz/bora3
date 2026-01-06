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
import { useState, useEffect } from "react";
import {
  IIconWidget,
  ConditionalRule,
  IconFormat,
} from "@/types/widgets";
import { IconWidget } from "./widget";
import { IconConditionsModal } from "./IconConditionsModal";
import Image from "next/image";

export function IconWidgetComponent({ widget }: { widget: IIconWidget }) {
  const {
    value,
    defaultIcon,
    conditions,
  } = widget;

  let iconToDisplay = defaultIcon;
  if (conditions && typeof value === "number") {
    for (const rule of conditions) {
      if (IconWidget.evaluateCondition(value, rule.condition, rule.value)) {
        iconToDisplay = rule.format.icon;
        break;
      }
    }
  }

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: widget.width ? `${widget.width}px` : "auto",
    height: widget.height ? `${widget.height}px` : "auto",
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      {iconToDisplay && (
        <Image
          src={`/icons/${iconToDisplay}`}
          alt={iconToDisplay}
          width={widget.width || 64}
          height={widget.height || 64}
          style={{ objectFit: "contain" }}
        />
      )}
    </div>
  );
}

export function IconWidgetForm({ widget }: { widget?: IIconWidget }) {
  const isEditMode = !!widget;

  const [currentStep, setCurrentStep] = useState(0);
  const [availableIcons, setAvailableIcons] = useState<string[]>([]);

  const [dataId, setDataId] = useState(
    (widget?.dataSource?.type === "database" ? widget.dataSource.dataId : "") || ""
  );

  const [dataSourceType, setDataSourceType] = useState<"database" | "calculation">(
    widget?.dataSource?.type || "database"
  );
  const [expression, setExpression] = useState(
    (widget?.dataSource?.type === "calculation" ? widget.dataSource.expression : "") || ""
  );
  const [dataIdsString, setDataIdsString] = useState(
    (widget?.dataSource?.type === "calculation" ? widget.dataSource.dataIds.join(", ") : "") || ""
  );

  const [defaultIcon, setDefaultIcon] = useState(widget?.defaultIcon || "");
  const [width, setWidth] = useState(widget?.width ?? "");
  const [height, setHeight] = useState(widget?.height ?? "");
  const [conditions, setConditions] = useState<ConditionalRule<IconFormat>[]>(
    widget?.conditions || []
  );

  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);

  const previewValue = 50;

  const steps = [
    { title: "Data Source", description: "Configure data input" },
    { title: "Icons", description: "Select default icon" },
    { title: "Dimensions", description: "Set size" },
    { title: "Conditions", description: "Icon rules" },
  ];

  // Fetch available icons
  useEffect(() => {
    fetch('/api/icons')
      .then(res => res.json())
      .then(data => {
        if (data.icons && Array.isArray(data.icons)) {
          setAvailableIcons(data.icons);
          if (!defaultIcon && data.icons.length > 0) {
            setDefaultIcon(data.icons[0]);
          }
        }
      })
      .catch(err => console.error('Failed to fetch icons:', err));
  }, []);

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

  let previewIcon = defaultIcon;
  if (conditions && typeof previewValue === "number") {
    for (const rule of conditions) {
      if (IconWidget.evaluateCondition(previewValue, rule.condition, rule.value)) {
        previewIcon = rule.format.icon;
        break;
      }
    }
  }

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
                  placeholder="e.g. sensor_temp_1"
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
                  <Input
                    id="expression"
                    type="text"
                    name="expression"
                    value={expression}
                    onChange={(e) => {
                      const newExpr = e.target.value;
                      setExpression(newExpr);
                      const variables = Array.from(newExpr.matchAll(/[a-zA-Z_][a-zA-Z0-9_]*/g))
                        .map(m => m[0])
                        .filter(v => !['sin', 'cos', 'tan', 'sqrt', 'log', 'exp', 'pi', 'e', 'abs', 'min', 'max'].includes(v));

                      const uniqueVars = Array.from(new Set(variables));
                      setDataIdsString(uniqueVars.join(", "));
                    }}
                    placeholder="e.g. (temp1 + temp2) / 2"
                    className="w-full"
                  />
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

        {/* Step 1: Icons */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="defaultIcon" className="mb-2 block text-sm font-medium">
                Default Icon
              </Label>
              <Select
                name="defaultIcon"
                value={defaultIcon}
                onValueChange={setDefaultIcon}
              >
                <SelectTrigger id="defaultIcon" className="w-full">
                  <SelectValue>
                    {defaultIcon && (
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/icons/${defaultIcon}`}
                          alt={defaultIcon}
                          width={24}
                          height={24}
                        />
                        <span>{defaultIcon.split('.')[0]}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableIcons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/icons/${icon}`}
                          alt={icon}
                          width={24}
                          height={24}
                        />
                        <span>{icon.split('.')[0]}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 2: Dimensions */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="width" className="block text-sm font-medium">
                  Width (px)
                </Label>
                <Input
                  name="width"
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="64"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="height" className="block text-sm font-medium">
                  Height (px)
                </Label>
                <Input
                  name="height"
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="64"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Conditions */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsConditionsModalOpen(true)}
                disabled={availableIcons.length === 0}
              >
                Configure Icon Conditions
              </Button>
              <div className="text-xs text-muted-foreground">
                {conditions.length} rule(s) active
              </div>
            </div>
            {availableIcons.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No icons available. Please add icons to the icons folder.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4 border rounded-md bg-gray-50/50 dark:bg-gray-900/50 max-h-[200px] overflow-auto w-full max-w-full">
        <div className="min-w-full min-h-full flex items-center justify-center p-4">
          <div
            className="border p-2 flex items-center justify-center bg-white dark:bg-black shadow-sm"
            style={{
              width: width ? `${width}px` : "auto",
              height: height ? `${height}px` : "auto",
            }}
          >
            {previewIcon && (
              <Image
                src={`/icons/${previewIcon}`}
                alt="Preview"
                width={Number(width) || 64}
                height={Number(height) || 64}
                style={{ objectFit: "contain" }}
              />
            )}
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

      <IconConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
        conditions={conditions}
        availableIcons={availableIcons}
        onSave={(newConditions) => {
          setConditions(newConditions);
          setIsConditionsModalOpen(false);
        }}
      />
      <input type="hidden" name="conditions" value={JSON.stringify(conditions)} />
    </div>
  );
}
