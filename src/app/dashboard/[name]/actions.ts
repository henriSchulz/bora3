"use server";

import { prisma } from "@/lib/prisma";
import { Dashboard } from "@prisma/client";
import { Widget as PrismaWidget } from "@prisma/client";
import { AnyWidget } from "./_components/WidgetRenderer";
import { transformWidgets } from "./_lib/widgetMapperFunctions";






export async function loadWidgets(dashboardId: string): Promise<AnyWidget[]> {
    const widgets: PrismaWidget[] = await prisma.widget.findMany({where: {dashboardId}});

    const frontendWidgets: AnyWidget[] = transformWidgets(widgets);

    return frontendWidgets;
}