import { z } from "zod";
import { BoraWidget } from "../core/bora-widget";
import { IValueWidget, Condition } from "@/types/widgets";
import { FC } from "react";
import { registerWidget } from "@/lib/decorators";

import { Widget as PrismaWidget } from "@prisma/client";

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
    // For now, delegate to base implementation; override later if needed
    public parseForm(dashboardId: string, formData: FormData): {widget?: Omit<PrismaWidget, "id" | "createdAt" | "updatedAt">, errors: string[]} {
        return super.parseForm(dashboardId, formData);
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

