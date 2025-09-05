import { Widget as PrismaWidget } from "@prisma/client";
import { BaseWidget, TextWidget, ValueWidget, IconWidget, DataSource } from "@/types/widgets";
import { WIDGET_MAP } from "../widgetMap";
import { Condition, Widget } from "@/types/widgets";


/*
====== General Widget Mapping Functions ======
These functions transform widgets from the database representation to the frontend types.
The `transformWidgets` function is the main entry point, which also fetches the real-time value
for data-driven widgets.
==============================================
*/

export async function transformWidgets(widgets: PrismaWidget[], data: Record<string, number>): Promise<Widget[]> {
    
    return widgets.map(widget => {
        const type = widget.type as Widget["type"];
        const props = widget.properties as any;
        

        let result = {...getBaseWidgetProperties(widget), type, value: 0}

        if (props.dataId) {
            result.value = data[props.dataId] || 0;
        }

        if(props.expression && props.dataIds) {
            // calculate value based on expression and dataIds
            result.value = -1; // Placeholder for actual calculation logic
        }


        const parsedProperties = WIDGET_MAP[type].schema.safeParse(widget.properties);

        if (!parsedProperties.success) {
            console.error(`Widget ID ${widget.id} has invalid properties:`, parsedProperties.error);
            throw new Error(`Invalid properties for widget ID ${widget.id}`);
        }

        if (typeof parsedProperties.data === "object" && parsedProperties.data !== null) {
            result = { ...result, ...parsedProperties.data };
        } else {
            console.warn(`Widget ID ${widget.id} properties could not be parsed, using default mapping.`);
            throw new Error(`Invalid properties for widget ID ${widget.id}`);
        }

        return result  as Widget;
    });
}


export function getBaseWidgetProperties(widget: PrismaWidget): Omit<BaseWidget, 'type'> {
    
    return {
        id: widget.id,
        dashboardId: widget.dashboardId,
        position: { x: widget.positionX, y: widget.positionY },
        width: widget?.width || 100,
        height: widget?.height || 50,
    };
}



/*====== Specific Widget Mapping Functions ======
These functions convert specific widget types from the database format to the frontend format.
Each function extracts common properties and type-specific properties.

Mapper function for new widget types should be added here.
==============================================*/















