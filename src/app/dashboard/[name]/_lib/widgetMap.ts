import TextWidgetComponent from "../_components/TextWidget";
import CalcWidgetComponent from "../_components/CalcWidget";
import ValueWidgetComponent from "../_components/ValueWidget";
import IconWidgetComponent from "../_components/IconWidget";
import { WidgetMap } from "../_types/widgetUtils";

import {
    toTextWidget,
    toCalcWidget,
    toValueWidget,
    toIconWidget
} from "./widgetMapperFunctions";


/*

===== WIDGET MAP =====
This map links widget types to their corresponding React components and mapper functions.
It is used to dynamically render widgets based on their type and to convert database records into frontend-compatible formats.

New widget types can be added here by defining their component and mapper function.

=========================

*/


export const WIDGET_MAP: WidgetMap = {
    TEXT: {
        component: TextWidgetComponent,
        mapper: toTextWidget
    },
    CALC: {
        component: CalcWidgetComponent,
        mapper: toCalcWidget
    },
    VALUE: {
        component: ValueWidgetComponent,
        mapper: toValueWidget
    },
    ICON: {
        component: IconWidgetComponent,
        mapper: toIconWidget
    }
}