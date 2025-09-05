import { Widget as PrismaWidget } from "@prisma/client";
import { Widget } from "@/types/widgets";
import { FC } from "react";


// The map for widget components and mappers.
// It maps a widget type string to its corresponding React component and a mapper function
// that transforms a Prisma widget object into a frontend widget object.
export type WidgetMap = {
    [key in Widget["type"]]: {
        component: FC<{ widget: Extract<Widget, { type: key }> }>;
        mapper: (widget: PrismaWidget, value?: number) => Widget;
    }
}

