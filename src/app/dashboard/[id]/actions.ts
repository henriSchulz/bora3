"use server";

import { prisma } from "@/lib/prisma";
import { Widget as PrismaWidget } from "@prisma/client";
import { transformWidgets } from "./_lib/transformWidgets";
import { fetchDataForWidgets } from "./_lib/redis";
import { revalidatePath } from "next/cache";
import { IWidget } from "@/widgets/core/autogen";


export async function loadWidgets(dashboardId: string): Promise<IWidget[]> {
    const widgets: PrismaWidget[] = await prisma.widget.findMany({where: {dashboardId}});

    const data = await fetchDataForWidgets(widgets);

    const frontendWidgets: IWidget[] = await transformWidgets(widgets, data);

    return frontendWidgets;
}

export async function updatePositions(dashboardId: string, updatedWidgets: IWidget[]) {
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