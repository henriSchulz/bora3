import { Condition, ValueWidget } from "@/types/widgets";
import { FC } from "react";
import { evaluateCondition } from "../app/dashboard/[id]/_lib/conditions";
import { Widget as PrismaWidget } from "@prisma/client";
import { getBaseWidgetProperties } from "../_lib/widgetMapperFunctions";
import { DataSource } from "@/types/widgets";
import {z} from "zod";

// export function toValueWidget(widget: PrismaWidget, value: number = 0): ValueWidget {
//     const baseProps = getBaseWidgetProperties(widget);
//     const properties = widget.properties as any;
    
//     const dataSource: DataSource = properties.expression
//         ? { type: 'calculation', expression: properties.expression, dataIds: properties.dataIds || [] }
//         : { type: 'database', dataId: properties.dataId || '' };

//     return {
//         ...baseProps,
//         type: "VALUE",
//         dataSource,
//         value,
//         textContent: properties?.textContent,
//         unit: properties?.unit,
//         decimalPlaces: properties?.decimalPlaces,
//         exp: properties?.exp,
//         fontSize: properties?.fontSize,
//         fontWeight: properties?.fontWeight,
//         backgroundColor: properties?.backgroundColor,
//         defaultTextColor: properties?.defaultTextColor,
//         conditions: properties?.conditions || [],
//     };
// }

export const valueWidgetSchema = z.object({
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
  conditions: z.array(z.object({
    condition: z.enum(Object.values(Condition)),
    value: z.union([z.number(), z.array(z.number())]),
    format: z.object({
      color: z.string()
    })
  })).optional()
});



export function ValueWidgetComponent({ widget }: { widget: ValueWidget }) {
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
      if (evaluateCondition(value, rule.condition, rule.value)) {
        textColor = rule.format.color;
        break; 
      }
    }
  }

  // Format the value
  const formattedValue = value.toFixed(decimalPlaces);

  const containerStyle = {
    backgroundColor,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px'
  };

  const textStyle = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontWeight,
  };

  return (
    <div>
      {textContent && <span style={{...textStyle, fontSize: `${fontSize * 0.8}px`}}>{textContent}</span>}
      <span style={textStyle}>
        {formattedValue} &nbsp;{unit}
      </span>
    </div>
  );
}
