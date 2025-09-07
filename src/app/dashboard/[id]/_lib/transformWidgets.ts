import { Widget as PrismaWidget } from "@prisma/client";

import { IWidget, widgetRegistry, WidgetType } from "@/widgets/core/autogen";

/*
====== General Widget Mapping Functions ======
These functions transform widgets from the database representation to the frontend types.
The `transformWidgets` function is the main entry point, which also fetches the real-time value
for data-driven widgets.
==============================================
*/

export async function transformWidgets(widgets: PrismaWidget[], data: Record<string, number>): Promise<IWidget[]> {
    
    return widgets.map(widget => {
        const type = widget.type as WidgetType
        const props = widget.properties as any;

        const boraWidget = widgetRegistry[type];
        if (!boraWidget) {
            throw new Error(`Unknown widget type: ${widget.type}`);
        }
        
        let value: number = 0;

        if (props.dataId) {
            value = data[props.dataId] ?? 0;
        }

        if(props.expression && props.dataIds) {
            // calculate value based on expression and dataIds
            value = -1; // Placeholder for actual calculation logic
        }
        return {...boraWidget.fromDB(widget), value}
    });
}













