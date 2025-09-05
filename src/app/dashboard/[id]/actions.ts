"use server";

import { prisma } from "@/lib/prisma";
import { Dashboard} from "@prisma/client";
import { Widget as PrismaWidget } from "@prisma/client";
import { Widget } from "@/types/widgets";
import { transformWidgets } from "../../../widgets/lib/widgetMapperFunctions";
import { fetchDataForWidgets } from "./_lib/redis";
import { revalidatePath } from "next/cache";





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

export async function deleteWidget(widgetId: string): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];
    try {
        await prisma.widget.delete({
            where: { id: widgetId },
        });
    } catch (error) {
        console.error("Error deleting widget:", error);
        errors.push("Failed to delete widget. Please try again.");
    }

    revalidatePath(`/dashboard/${widgetId}`);
    return { success: errors.length === 0, errors };
    
}