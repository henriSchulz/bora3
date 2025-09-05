import {TextWidgetComponent, TextWidgetForm, textWidgetSchema,} from "./text-widget";
import {ValueWidgetComponent, valueWidgetSchema} from "./value-widget";
import {IconWidgetComponent, iconWidgetSchema} from "./icon-widget";
import { Widget } from "@/types/widgets";
import { FC, CSSProperties } from "react";
import { Widget as PrismaWidget } from "@prisma/client";
import { ZodTypeAny } from "zod";

export type WidgetMap = {
    [key in Widget["type"]]: {
        component: FC<{ widget: Extract<Widget, { type: key }> }>;
        form: FC<{ widget?: Extract<Widget, { type: key }> }>;
        name: string;
        schema: ZodTypeAny; // Zod schema for validation
    }
}

/*

===== WIDGET MAP =====
This map links widget types to their corresponding React components and mapper functions.
It is used to dynamically render widgets based on their type and to convert database records into frontend-compatible formats.

New widget types can be added here by defining their component and mapper function.

=========================

*/

export const WIDGET_MAP: WidgetMap = {
    TEXT: {
        component: TextWidgetComponent,
        name: "Text",
        form: TextWidgetForm,
        schema: textWidgetSchema
    },
    VALUE: {
        component: ValueWidgetComponent,
        name: "Value",
        schema: valueWidgetSchema
    },
    ICON: {
        component: IconWidgetComponent,
        name: "Icon",
        schema: iconWidgetSchema
    }
}