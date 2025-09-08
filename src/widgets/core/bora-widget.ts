import { IBaseWidget } from "@/types/widgets";
import { FC } from "react";
import { ZodTypeAny } from "zod";
import { Widget as PrismaWidget } from "@prisma/client";
import { WidgetType } from "./autogen";
import { ZodObject } from "zod";
import { JsonValue } from "@prisma/client/runtime/library";

export abstract class BoraWidget<T extends IBaseWidget> {
  protected zodSchema: ZodTypeAny;

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



  // Normalizes raw FormData entries (all strings / File) into typed JS values before Zod validation.

  protected normalizeFormEntries(formData: FormData): Record<string, any> {
    const obj: Record<string, any> = {};
    for (const [key, raw] of formData.entries()) {
      if (raw instanceof File) {
        obj[key] = raw; // Leave file handling to specific widget implementations
        continue;
      }
      let value: any = typeof raw === "string" ? raw.trim() : raw;

      if (value === "") {
        obj[key] = undefined;
        continue;
      }

      if (typeof value === "string") {
        // boolean
        if (/^(true|false)$/i.test(value)) {
          obj[key] = value.toLowerCase() === "true";
          continue;
        }
        // number
        if (/^-?\d+(?:\.\d+)?$/.test(value)) {
          const num = Number(value);
            if (!Number.isNaN(num)) {
              obj[key] = num;
              continue;
            }
        }
        // JSON
        if ((value.startsWith("{") && value.endsWith("}")) || (value.startsWith("[") && value.endsWith("]"))) {
          try {
            obj[key] = JSON.parse(value);
            continue;
          } catch {/* ignore parse errors, keep original string */}
        }
      }
      obj[key] = value;
    }
    return obj;
  }
// default implementation of parseForm extracts the commen props if the names match the schema. Override in subclasses if needed.
  public parseForm(dashboardId: string, formData: FormData): {widget?: Omit<PrismaWidget, "id" | "createdAt" | "updatedAt">, error?: string} {
    const formObject = this.normalizeFormEntries(formData);
    const result = this.zodSchema.safeParse(formObject);

    if (!result.success) {
      console.error("Form data validation failed:", result.error);
      return { 
        error: result.error.issues.map(issue => `${issue.path.join('.') || '<root>'}: ${issue.message}`).join('; ')
       };
    }

    const position = { x: 0.2, y: 0.2 }; // Default position for new widgets

    const {width, height, ...properties} = result.data as any;

    const baseProps = {
      dashboardId,
      type: (this.constructor as typeof BoraWidget).name as WidgetType,
      positionX: position.x,
      positionY: position.y,
      width: width || 100,
      height: height || 50,
    };

    return {
      widget: {
      ...baseProps,
      properties
      },
    };
  }

  
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
