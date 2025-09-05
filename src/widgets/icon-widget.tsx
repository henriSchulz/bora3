import { IconWidget } from "@/types/widgets";
import {z} from "zod";
import { Condition } from "@/types/widgets";


export const iconWidgetSchema = z.object({
    dataId: z.string().optional(),
    expression: z.string().optional(),
    dataIds: z.array(z.string()).optional(),
    value: z.number().optional(),
    defaultIcon: z.string().optional(),
    conditions: z.array(z.object({
        condition: z.enum(Object.values(Condition)) ,
        
        value: z.union([z.number(), z.array(z.number())]),
        format: z.object({
            icon: z.string()
        })
    })).optional()
});


// export function toIconWidget(widget: PrismaWidget, value: number = 0): IconWidget {
//     const baseProps = getBaseWidgetProperties(widget);
//     const properties = widget.properties as any;

//     const dataSource: DataSource = properties.expression
//         ? { type: 'calculation', expression: properties.expression, dataIds: properties.dataIds || [] }
//         : { type: 'database', dataId: properties.dataId || '' };

//     return {
//         ...baseProps,
//         type: "ICON",
//         dataSource,
//         value,
//         defaultIcon: properties?.defaultIcon || 'fa-solid fa-question',
//         conditions: properties?.conditions || [],
//     };
// }


export function IconWidgetComponent({
  widget,
}: {
  widget: IconWidget;
}) {
  return <div>Icon Widget</div>;
}
