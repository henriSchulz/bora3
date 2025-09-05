import { Widget as PrismaWidget } from "@prisma/client";
import { TextWidet, CalcWidget, ValueWidget, IconWidget, WidgetType } from "@/types/widgets";
import { FC } from "react";

export type AnyWidget = TextWidet | CalcWidget | ValueWidget | IconWidget;

export type WidgetMap = {
    [key in WidgetType]: {
        component: FC<{widget: Extract<AnyWidget, {type: key}>}>;
        mapper: (widget: PrismaWidget) => Extract<AnyWidget, {type: key}>; // maps PrismaWidget to FrontendWidget 
    }
}