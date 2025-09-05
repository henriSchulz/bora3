import { Widget as PrismaWidget } from "@prisma/client";
import { Widget as FontendWidget, LabeldWidget, TextWidet, CalcWidget, ValueWidget, IconWidget, WidgetType } from "@/types/widgets";
import { WIDGET_MAP } from "./widgetMap";
import { AnyWidget } from "../_types/widgetUtils";
/*

====== General Widget Mapping Functions ======
These functions are used to map the widgets from the database to the frontend types.
==============================================

*/

export function transformWidgets(widgets: PrismaWidget[]): AnyWidget[] {
    return widgets.map(widget => {
        return WIDGET_MAP[widget.type].mapper(widget);
    });
}





// Utility function to extract common properties of widgets

function getDefaultWidgetProperties(widget: PrismaWidget) {
    const position = {x: widget.positionX, y: widget.positionY};
    const id = widget.id;
    const dashboardId = widget.dashboardId;
    const type = widget.type;
    
    return {position, id, dashboardId, type};
}


/*

====== Individual Widget Mapping Functions ======
These functions are used to map the individual widgets from the database to the frontend types.

Functions for new widget types can be added here:

=================================================

*/


export function toTextWidget(widget: PrismaWidget): TextWidet {
    const baseProps = getDefaultWidgetProperties(widget);
    const properties = widget.properties as Omit<TextWidet, keyof FontendWidget>;

    return {
        ...baseProps,
        textContent: properties?.textContent || "Default Text",
        fontSize: properties?.fontSize || 16,
        fontWeight: properties?.fontWeight || "normal",
        height: properties?.height || 50,
        width: properties?.width || 150,
        backgroundColor: properties?.backgroundColor || "transparent",
        defaultTextColor: properties?.defaultTextColor || "black",
        type: "TEXT"
    };
}

export function toCalcWidget(widget: PrismaWidget): CalcWidget {
    const baseProps = getDefaultWidgetProperties(widget);
    const properties = widget.properties as Omit<CalcWidget, keyof FontendWidget>;
    return {
        ...baseProps,
        textContent: properties?.textContent || "0",
        expression: properties?.expression || "0",
        fontSize: properties?.fontSize || 16,
        fontWeight: properties?.fontWeight || "normal",
        height: properties?.height || 50,
        width: properties?.width || 150,
        backgroundColor: properties?.backgroundColor || "transparent",
        defaultTextColor: properties?.defaultTextColor || "black",
        type: "CALC",
        conditions: properties?.conditions || [],
        dataIds: properties?.dataIds || [],
    };
}

export function toValueWidget(widget: PrismaWidget): ValueWidget {
    const baseProps = getDefaultWidgetProperties(widget);
    const properties = widget.properties as Omit<ValueWidget, keyof FontendWidget>;
    return {
        ...baseProps,
        textContent: properties?.textContent || "0",
        unit: properties?.unit || "",
        fontSize: properties?.fontSize || 16,
        fontWeight: properties?.fontWeight || "normal",
        height: properties?.height || 50,
        width: properties?.width || 150,
        backgroundColor: properties?.backgroundColor || "transparent",
        defaultTextColor: properties?.defaultTextColor || "black",
        type: "VALUE",
        conditions: properties?.conditions || [],
        dataId: properties.dataId
    };
}

export function toIconWidget(widget: PrismaWidget): IconWidget {
    const baseProps = getDefaultWidgetProperties(widget);
    const properties = widget.properties as Omit<IconWidget, keyof FontendWidget>;
    return {
        ...baseProps,
        height: properties?.height || 50,
        width: properties?.width || 50,
        type: "ICON",
        conditions: properties?.conditions || [],
        dataId: properties.dataId,
    };
}




