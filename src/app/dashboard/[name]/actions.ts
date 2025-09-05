"use server";

import { prisma } from "@/lib/prisma";
import { Dashboard} from "@prisma/client";
import { Widget as PrismaWidget } from "@prisma/client";
import { Widget } from "@/types/widgets";
import { transformWidgets } from "./_lib/widgetMapperFunctions";
import { fetchDataForWidgets } from "./_lib/redis";





export async function loadWidgets(dashboardId: string): Promise<Widget[]> {
    const widgets: PrismaWidget[] = await prisma.widget.findMany({where: {dashboardId}});

    const data = await fetchDataForWidgets(widgets);

    const frontendWidgets: Widget[] = await transformWidgets(widgets, data);

    return frontendWidgets;
}

export async function updatePositions(dashboardId: string, updatedWidgets: Widget[]) {
    const updatePromises = updatedWidgets.map(widget => {
        return prisma.widget.update({
            where: { id: widget.id },
            data: {
                positionX: widget.position.x,
                positionY: widget.position.y,
            },
        });
    });

    await Promise.all(updatePromises);
}