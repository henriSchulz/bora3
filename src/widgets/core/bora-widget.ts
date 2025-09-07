import { IBaseWidget } from "@/types/widgets";
import { FC } from "react";
import { ZodTypeAny } from "zod";
import { Widget as PrismaWidget } from "@prisma/client";
import { WidgetType } from "./autogen";


export abstract class BoraWidget<T extends IBaseWidget> {
  private zodSchema: ZodTypeAny;

  public constructor(zodSchema: ZodTypeAny) {
    this.zodSchema = zodSchema;
  }

  public static getBaseProperties(widget: PrismaWidget): IBaseWidget {
    return {
      id: widget.id,
      dashboardId: widget.dashboardId,
      position: { x: widget.positionX, y: widget.positionY },
      width: widget?.width || 100,
      height: widget?.height || 50,
      type: widget.type,
    };
  } // Extracts and returns the base properties common to all widgets

  public abstract render(): FC<{ widget: T }>;

  public abstract renderForm(): FC<{ widget?: T }>; // widget is undefined when creating a new widget and defined when an existing widget is edited

  public abstract parseForm(dashboardId: string, formData: FormData): {widget?: Omit<T, "id">, error?: string}; // Function to convert form data to widget data

  public fromDB(prismaWidget: PrismaWidget): Omit<T,  | never> {
    const parsedProperties = this.zodSchema.safeParse(prismaWidget.properties);

    if (!parsedProperties.success) {
      console.error(
        `Widget ID ${prismaWidget.id} has invalid properties:`,
        parsedProperties.error
      );
      throw new Error(`Invalid properties for widget ID ${prismaWidget.id}`);
    }

    if (
      typeof parsedProperties.data === "object" &&
      parsedProperties.data !== null
    ) {
      return {
       ...BoraWidget.getBaseProperties(prismaWidget),
        ...parsedProperties.data,
      } as T;
    } else {
      console.error(
        `Widget ID ${prismaWidget.id} has invalid properties:`,
        parsedProperties.error
      );
      throw new Error(`Invalid properties for widget ID ${prismaWidget.id}`);
    }
  } // Converts a PrismaWidget to the frontend widget type T using the Zod schema for validation

  public getSchema(): ZodTypeAny {
    return this.zodSchema;
  } // Returns the Zod schema for external validation if needed
}
