import { ITextWidget } from "@/types/widgets";
import { BoraWidget } from "../core/bora-widget";
import { z } from "zod";
import { registerWidget } from "@/lib/decorators";



@registerWidget("Text")
export class TextWidget extends BoraWidget<ITextWidget> {
  public constructor() {
    const textWidgetSchema = z.object({
      textContent: z.string(
        "Text content must be a string"
      ).min(1, "Text content is required"),
      fontSize: z
        .number("Font size must be a number")
        .min(1, "Font size must be at least 1")
        .optional()
        .default(14),
      fontWeight: z.enum(["normal", "bold"]).optional().default("normal"),
      backgroundColor: z.string().optional().default("transparent"),
      defaultTextColor: z.string().optional().default("black"),
      width: z.number(
        "Width must be a number"
      )
      .min(1, "Width must be at least 10")
      .optional(),
      height: z.number(
        "Height must be a number"
      )
      .min(1, "Height must be at least 10").optional(),
    });
  super(textWidgetSchema);
  }

}

