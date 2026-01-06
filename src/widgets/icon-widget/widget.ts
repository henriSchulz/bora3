import { z } from "zod";
import { BoraWidget } from "../core/bora-widget";
import { IIconWidget, Condition } from "@/types/widgets";
import { registerWidget } from "@/lib/decorators";
import { Widget as PrismaWidget } from "@prisma/client";

@registerWidget("Icon")
export class IconWidget extends BoraWidget<IIconWidget> {
  public constructor() {
    const iconWidgetSchema = z.object({
      dataSource: z.union([
        z.object({
          type: z.literal("database"),
          dataId: z.string(),
        }),
        z.object({
          type: z.literal("calculation"),
          expression: z.string(),
          dataIds: z.array(z.string()),
        })
      ]).optional(),
      // Legacy fields for backward compatibility
      dataId: z.string().optional(),
      expression: z.string().optional(),
      dataIds: z.array(z.string()).optional(),
      defaultIcon: z.string().nullable().optional(),
      width: z.number().min(1).optional(),
      height: z.number().min(1).optional(),
      conditions: z
        .array(
          z.object({
            condition: z.enum(Object.values(Condition) as [string, ...string[]]),
            value: z.union([z.number(), z.array(z.number())]),
            format: z.object({
              icon: z.string(),
            }),
          })
        )
        .nullable()
        .optional(),
    });
    super(iconWidgetSchema);
  }

  public fromDB(prismaWidget: PrismaWidget): IIconWidget {
    const parsedProperties = this.zodSchema.safeParse(prismaWidget.properties);

    if (!parsedProperties.success) {
      console.error(
        `Widget ID ${prismaWidget.id} has invalid properties:`,
        parsedProperties.error
      );
      throw new Error(`Invalid properties for widget ID ${prismaWidget.id}`);
    }

    const props = parsedProperties.data as any;

    // Normalize legacy fields to dataSource
    let dataSource = props.dataSource;
    if (!dataSource) {
      if (props.expression && props.dataIds) {
        dataSource = {
          type: "calculation",
          expression: props.expression,
          dataIds: props.dataIds
        };
      } else if (props.dataId) {
        dataSource = {
          type: "database",
          dataId: props.dataId
        };
      } else {
        // Default or empty
        dataSource = { type: "database", dataId: "" };
      }
    }

    return {
      ...BoraWidget.getBaseProperties(prismaWidget),
      ...props,
      dataSource,
      defaultIcon: props.defaultIcon || "",
      conditions: props.conditions || [],
      type: "Icon",
      value: 0, // Initial value, will be overwritten by transformWidgets
    };
  }

  public parseForm(dashboardId: string, formData: FormData): {widget?: Omit<PrismaWidget, "id" | "createdAt" | "updatedAt">, errors: string[]} {
    const errors: string[] = [];

    try {
      const dataSourceType = formData.get("dataSourceType") as string;
      let dataSource: any;

      if (dataSourceType === "database") {
        dataSource = {
          type: "database",
          dataId: formData.get("dataId") as string,
        };
      } else if (dataSourceType === "calculation") {
        const dataIdsString = formData.get("dataIds") as string;
        let dataIds: string[] = [];
        try {
          dataIds = JSON.parse(dataIdsString);
        } catch (e) {
          // Fallback
        }

        dataSource = {
          type: "calculation",
          expression: formData.get("expression") as string,
          dataIds: dataIds,
        };
      }

      const conditionsString = formData.get("conditions") as string;
      let conditions: any[] = [];
      if (conditionsString) {
        try {
          conditions = JSON.parse(conditionsString);
        } catch (e) {
          console.error("Failed to parse conditions", e);
        }
      }

      const widgetData = {
        dashboardId,
        type: "Icon",
        positionX: 0,
        positionY: 0,
        properties: {
          dataSource,
          defaultIcon: formData.get("defaultIcon") as string,
          width: Number(formData.get("width")) || undefined,
          height: Number(formData.get("height")) || undefined,
          conditions,
        },
      };

      return { widget: widgetData as any, errors: [] };

    } catch (error) {
      return { errors: ["Failed to parse form data"] };
    }
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
