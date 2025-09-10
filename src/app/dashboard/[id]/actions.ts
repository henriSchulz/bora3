"use server";

import { prisma } from "@/lib/prisma";
import { Widget as PrismaWidget } from "@prisma/client";
import { transformWidgets } from "./_lib/transformWidgets";
import { fetchDataForWidgets } from "./_lib/redis";
import { revalidatePath } from "next/cache";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { IWidget, WidgetType } from "@/widgets/core/autogen.types";
import { widgetLogicRegistry } from "@/widgets/core/autogen.logic";

export async function loadWidgets(dashboardId: string): Promise<IWidget[]> {
  const widgets: PrismaWidget[] = await prisma.widget.findMany({
    where: { dashboardId },
  });

  const data = await fetchDataForWidgets(widgets);

  const frontendWidgets: IWidget[] = await transformWidgets(widgets, data);

  return frontendWidgets;
}

export async function updatePositions(
  dashboardId: string,
  updatedWidgets: IWidget[]
) {
  const updatePromises = updatedWidgets.map((widget) => {
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

export async function deleteWidget(
  widgetId: string
): Promise<{ success: boolean; errors: string[] }> {
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

export async function createWidget(
  dashboardId: string,
  type: WidgetType,
  formData: FormData
): Promise<{ errors: string[] }> {
  try {
    const instance = widgetLogicRegistry[type];

    if (!instance) {
      return { errors: [`Widget type "${type}" is not recognized.`] };
    }

    const parseFormResult = instance.parseForm(dashboardId, formData);

    if (parseFormResult.errors.length > 0) {
      return { errors: parseFormResult.errors };
    }

    const widget = parseFormResult.widget;
    if (!widget) {
      return {
        errors: parseFormResult.errors || ["Failed to parse widget data."],
      };
    }
    console.log("Creating widget with data:", widget);

    await prisma.widget.create({
      data: {
        ...widget,
        properties: widget.properties as InputJsonValue,
      },
    });

    revalidatePath(`/dashboard/${widget.dashboardId}`);
    return { errors: [] };
  } catch (error) {
    console.error("Error creating widget:", error);
    return {
      errors: ["Failed to create widget. Please try again."],
    };
  }
}
