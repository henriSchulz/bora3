import { z } from "zod";
import { BoraWidget } from "./core/bora-widget";
import { IValueWidget, Condition } from "@/types/widgets";
import { FC } from "react";
import { registerWidget } from "@/lib/decorators";



@registerWidget("Value")
export class ValueWidget extends BoraWidget<IValueWidget> {
  public constructor() {
    const valueWidgetSchema = z.object({
      dataId: z.string().optional(),
      expression: z.string().optional(),
      dataIds: z.array(z.string()).optional(),
      textContent: z.string().optional(),
      unit: z.string().optional(),
      decimalPlaces: z.number().min(0).max(10).optional(),
      fontSize: z.number().min(8).max(72).optional(),
      fontWeight: z.enum(["normal", "bold", "bolder", "lighter"]).optional(),
      backgroundColor: z.string().optional(),
      defaultTextColor: z.string().optional(),
      conditions: z
        .array(
          z.object({
            condition: z.enum(Object.values(Condition)),
            value: z.union([z.number(), z.array(z.number())]),
            format: z.object({
              color: z.string(),
            }),
          })
        )
        .optional(),
    });
    super(valueWidgetSchema);
  }

  public render(): FC<{ widget: IValueWidget; }> {
    return ValueWidgetComponent;
  }

  public renderForm(): FC<{ widget?: IValueWidget | undefined; }> {
    return () => <div>Value Widget Form - To be implemented</div>;
  }

  public parseForm(dashboardId: string, formData: FormData): {widget?: Omit<IValueWidget, "id">, error?: string} {
    return {error: "Not implemented yet"};
  }


  public static evaluateCondition(value: number, condition: Condition, conditionValue: number | [number, number]): boolean {
    switch (condition) {
        case Condition.Equals:
            return value === conditionValue;
        case Condition.NotEquals:
            return value !== conditionValue;
        case Condition.LessThan:
            return value < (conditionValue as number);
        case Condition.GreaterThan:
            return value > (conditionValue as number);
        case Condition.LessThanEquals:
            return value <= (conditionValue as number);
        case Condition.GreaterThanEquals:
            return value >= (conditionValue as number);
        case Condition.IsInInclusiveInterval:
            if (Array.isArray(conditionValue)) {
                return value >= conditionValue[0] && value <= conditionValue[1];
            }
            return false;
        case Condition.IsInExclusiveInterval:
            if (Array.isArray(conditionValue)) {
                return value > conditionValue[0] && value < conditionValue[1];
            }
            return false;
        case Condition.IsInLeftInclusiveRightExclusiveInterval:
            if (Array.isArray(conditionValue)) {
                return value >= conditionValue[0] && value < conditionValue[1];
            }
            return false;
        case Condition.IsInLeftExclusiveRightInclusiveInterval:
            if (Array.isArray(conditionValue)) {
                return value > conditionValue[0] && value <= conditionValue[1];
            }
            return false;
        default:
            return false;
    }
}
}

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
  if (conditions) {
    for (const rule of conditions) {
      if (ValueWidget.evaluateCondition(value, rule.condition, rule.value)) {
        textColor = rule.format.color;
        break;
      }
    }
  }

  // Format the value
  const formattedValue = value.toFixed(decimalPlaces);

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
