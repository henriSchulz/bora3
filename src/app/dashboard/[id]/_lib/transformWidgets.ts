"use client";

import { Widget as PrismaWidget } from "@prisma/client";

import { IWidget, WidgetType } from "@/widgets/core/autogen";
import { widgetRegistry } from "@/widgets/core/autogen.client";
import { IconWidget } from '@/widgets/icon-widget';
import { TextWidget } from '@/widgets/text-widget';
import { ValueWidget } from '@/widgets/value-widget';

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
        
    
                // Instantiate only the needed widget class server-side for fromDB logic.
                // (Could be optimized with a factory map if many widgets.)
        const instance = widgetRegistry[type];
        
        if (!instance) {
            throw new Error(`No widget registered for type: ${type}`);
        }

        
        let value: number = 0;

        if (props.dataId) {
            value = data[props.dataId] ?? 0;
        }

        if(props.expression && props.dataIds) {
            // calculate value based on expression and dataIds
            value = -1; // Placeholder for actual calculation logic
        }
    return {...instance.fromDB(widget), value}
    });
}













