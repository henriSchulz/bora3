import { Widget as PrismaWidget } from "@prisma/client";
import { BaseWidget, TextWidget, ValueWidget, IconWidget, DataSource } from "@/types/widgets";
import { WIDGET_MAP } from "./widgetMap";
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
        //placeholders
        const type = widget.type as Widget["type"];
        const props = widget.properties as any;
        let value = 0;

        if (props.dataId) {
            value = data[props.dataId] || 0;
        }
        if(props.expression && props.dataIds) {
            // calculate value based on expression and dataIds
            value = -1; // Placeholder for actual calculation logic
        }

        return WIDGET_MAP[type].mapper(widget, value);
    });
}


function getBaseWidgetProperties(widget: PrismaWidget): Omit<BaseWidget, 'type'> {
    
    return {
        id: widget.id,
        dashboardId: widget.dashboardId,
        position: { x: widget.positionX, y: widget.positionY },
        width: widget?.width || 100,
        height: widget?.height || 100,
    };
}



/*====== Specific Widget Mapping Functions ======
These functions convert specific widget types from the database format to the frontend format.
Each function extracts common properties and type-specific properties.

Mapper function for new widget types should be added here.
==============================================*/





export function toTextWidget(widget: PrismaWidget): TextWidget {
    const baseProps = getBaseWidgetProperties(widget);
    const properties = widget.properties as Partial<Omit<TextWidget, keyof BaseWidget>>;

    return {
        ...baseProps,
        type: "TEXT",
        textContent: properties?.textContent || "Default Text",
        fontSize: properties?.fontSize,
        fontWeight: properties?.fontWeight,
        backgroundColor: properties?.backgroundColor,
        defaultTextColor: properties?.defaultTextColor,
    };
}

export function toValueWidget(widget: PrismaWidget, value: number = 0): ValueWidget {
    const baseProps = getBaseWidgetProperties(widget);
    const properties = widget.properties as any;
    
    const dataSource: DataSource = properties.expression
        ? { type: 'calculation', expression: properties.expression, dataIds: properties.dataIds || [] }
        : { type: 'database', dataId: properties.dataId || '' };

    return {
        ...baseProps,
        type: "VALUE",
        dataSource,
        value,
        textContent: properties?.textContent,
        unit: properties?.unit,
        decimalPlaces: properties?.decimalPlaces,
        exp: properties?.exp,
        fontSize: properties?.fontSize,
        fontWeight: properties?.fontWeight,
        backgroundColor: properties?.backgroundColor,
        defaultTextColor: properties?.defaultTextColor,
        conditions: properties?.conditions || [],
    };
}

export function toIconWidget(widget: PrismaWidget, value: number = 0): IconWidget {
    const baseProps = getBaseWidgetProperties(widget);
    const properties = widget.properties as any;

    const dataSource: DataSource = properties.expression
        ? { type: 'calculation', expression: properties.expression, dataIds: properties.dataIds || [] }
        : { type: 'database', dataId: properties.dataId || '' };

    return {
        ...baseProps,
        type: "ICON",
        dataSource,
        value,
        defaultIcon: properties?.defaultIcon || 'fa-solid fa-question',
        conditions: properties?.conditions || [],
    };
}







