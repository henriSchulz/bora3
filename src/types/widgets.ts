export type Point = {x: number, y:number};



/*
==== WIDGET TYPES ====

These widgets are fronntend types only. The database representation is in prisma/schema.prisma




*/

export type WidgetType = "TEXT" | "VALUE" | "CALC" | "ICON";

export interface Widget {
    id: string; 
    position: Point;
    type: string; // "TEXT", "VALUE", "CALC", "ICON"
    dashboardId: string;
}

type FontWeight = "normal" | "bold";

enum Condition {
    Equals = "equals",
    LessThan = "less-than",
    GreaterThan = "greater-than",
    NotEquals = "not-equals",
    LessThanEquals = "less-than-equals",
    GreaterThanEquals = "greater-than-equals",
    IsInExclusiveInterval = "is-in-exclusive-interval",
    IsInInclusiveInterval = "is-in-inclusive-interval",
    IsInLeftExclusiveRightInclusiveInterval = "is-in-left-exclusive-right-inclusive-interval",
    IsInLeftInclusiveRightExclusiveInterval = "is-in-left-inclusive-right-exclusive-interval"
}



export interface LabeldWidget extends Widget {
    textContent: string;
    fontSize?: number; // default: 16
    fontWeight?: FontWeight // default: "normal"
    height: number;
    width: number;
    backgroundColor?: string; // default: "transparent"
    defaultTextColor?: string; // black
}

export interface TextWidet extends LabeldWidget {
    type: "TEXT";
}

export interface DataWidget extends LabeldWidget {
    unit?: string; // default: "" e.g. "kg", "m", "s", ...
    decimalPlaces?: number; // default: 2
    exp?: boolean // default: false, if true, use scientific notation: 1.23e+4
    
    conditions?: 
        {
            condition: Condition; // condition to evaluate
            value: number | [number, number]; // single value or interval
            color: string; // color to apply if condition is true
        }[]
    
}

export interface ValueWidget extends DataWidget {
    type: "VALUE";
    dataId: string;
    value: number;
}

export interface CalcWidget extends DataWidget {
    type: "CALC";
    expression: string; // e.g. "a + b * c"
    dataIds?: string[]; // e.g. ["a", "b", "c"]
    value: number; // default: 0
}

export interface IconWidget extends Widget {
    type: "ICON";
    height: number;
    width: number;
    dataId: string;
    value: number;
    conditions: 
        {
            condition: Condition; // condition to evaluate
            value: number | [number, number]; // single value or interval
            icon: string; // FontAwesome icon name e.g. "fa-solid fa-check"
        }[];
    
}
