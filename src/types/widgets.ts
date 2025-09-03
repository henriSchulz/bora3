export type Point = {x: number, y:number};

export interface Widget {
    id: string; 
    position: Point;
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


export interface LabeldWidgeet extends Widget {
    text: string;
    fontSize?: number; // default: 16
    fontWeight?: FontWeight // default: "normal"
    height: number;
    width: number;
    backgroundColor?: string; // default: "transparent"
    defaultTextColor?: string; // black
}

export interface TextWidet extends LabeldWidgeet {
    type: "text";
}

export interface DataWidget extends LabeldWidgeet {
    value: number;
    unit?: string; // default: "" e.g. "kg", "m", "s", ...
    decimalPlaces?: number; // default: 2
    exp?: boolean // default: false, if true, use scientific notation: 1.23e+4
    
    conditions?: [
        {
            condition: Condition; // condition to evaluate
            value: number | [number, number]; // single value or interval
            color: string; // color to apply if condition is true
        }
    ]
}

export interface ValueWidget extends DataWidget {
    type: "value";
}

export interface CalcWidget extends DataWidget {
    type: "calc";
    expression: string; // e.g. "a + b * c"
    
}

