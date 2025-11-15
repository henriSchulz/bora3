import { registerWidget } from "@/lib/decorators";

export type Point = { x: number; y: number }; // in percentage of dashboard size
// ========== Base Widget Types ==========

// All widgets share these properties
export interface IBaseWidget {
    id: string;
    position: Point;
    width: number | null;
    height: number | null;
    dashboardId: string;
    type: string;
}

// ========== Data Source Types ==========

// Defines where a widget gets its value from
export type DataSource =
    | { type: 'database'; dataId: string; } // directly  fetch a single data point
    | { type: 'calculation'; expression: string; dataIds: string[]; }; // fetches multiple data points and calculates a value

// ========== Conditional Formatting ==========

export enum Condition {
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

// Represents a single conditional rule
export type ConditionalRule<T> = {
    condition: Condition;
    value: number | [number, number]; // Single value or interval
    format: T;
};

// Specific format types
export type ColorFormat = { color: string };
export type IconFormat = { icon: string }; // e.g., "fa-solid fa-check"

// ========== Widget-Specific Interfaces ==========

type FontWeight = "normal" | "bold";


export interface ITextWidget extends IBaseWidget {
    type: "Text";
    textContent: string;
    fontSize?: number;
    fontWeight?: FontWeight;
    backgroundColor?: string;
    defaultTextColor?: string;
}

// --- Data-Driven Widgets ---



// --- Value Widget (Displays data as text) ---
export interface IValueWidget extends IBaseWidget {
    dataSource: DataSource;
    value: number; // The resolved value from the data source
    type: "Value";
    textContent?: string; // Optional label
    unit?: string;
    decimalPlaces?: number;
    exp?: boolean; // Scientific notation
    fontSize?: number;
    fontWeight?: FontWeight;
    backgroundColor?: string;
    defaultTextColor?: string;
    conditions?: ConditionalRule<ColorFormat>[];
}

// --- Icon Widget (Displays data as an icon) ---
export interface IIconWidget extends IBaseWidget {
    dataSource: DataSource;
    value: number; // The resolved value from the data source
    type: "Icon";
    defaultIcon: string; // Fallback icon
    conditions: ConditionalRule<IconFormat>[];
}

