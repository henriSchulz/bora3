
import { FC } from "react";
import TextWidgetComponent from "./TextWidget";
import { CalcWidget, Widget as FrontendWidget, IconWidget, TextWidet, ValueWidget } from "@/types/widgets";
import { CSSProperties } from "react";
import { WIDGET_MAP } from "../_lib/widgetMap";
import { AnyWidget } from "../_types/widgetUtils";




export default function WidgetRenderer({widget}: {widget: AnyWidget}) {

    const Component = WIDGET_MAP[widget.type].component as FC<{widget: AnyWidget}>;

   
    return <Component widget={widget}/>;


}





