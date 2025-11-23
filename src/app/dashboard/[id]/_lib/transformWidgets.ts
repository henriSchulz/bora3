
import { Widget as PrismaWidget } from "@prisma/client";

import { IWidget, WidgetType } from "@/widgets/core/autogen.types";

import { widgetLogicRegistry } from "@/widgets/core/autogen.logic";

import { evaluate } from 'mathjs';

import { latexToMathJs } from '@/lib/latex-to-mathjs';

/*
====== General Widget Mapping Functions ======
These functions transform widgets from the database representation to the frontend types.
The `transformWidgets` function is the main entry point, which also fetches the real-time value
for data-driven widgets.
==============================================
*/

export async function transformWidgets(widgets: PrismaWidget[], data: Record<string, number>): Promise<IWidget[]> {
    return widgets.map(widget => {
        const type = widget.type as WidgetType
        const props = widget.properties as any;
        
    
                // Instantiate only the needed widget class server-side for fromDB logic.
                // (Could be optimized with a factory map if many widgets.)
        const instance = widgetLogicRegistry[type];
        
        if (!instance) {
            throw new Error(`No widget registered for type: ${type}`);
        }

        
        let value: number = 0;

        if (props.dataSource) {
            if (props.dataSource.type === 'database' && props.dataSource.dataId) {
                value = data[props.dataSource.dataId] ?? (Math.random() * 100); // Random data fallback
            } else if (props.dataSource.type === 'calculation' && props.dataSource.expression && props.dataSource.dataIds) {
                 try {
                    const expression = props.dataSource.expression;
                    const dataIds = props.dataSource.dataIds as string[];

                    // Pre-process expression to handle LaTeX syntax
                    let processedExpression = latexToMathJs(expression);

                    // Create a scope with values for each dataId
                    const scope: Record<string, number> = {
                        c: 299792458,
                        G: 6.67430e-11,
                        h: 6.62607e-34,
                        g: 9.80665,
                        epsilon0: 8.854187817e-12,
                        mu0: 1.2566370614e-6,
                        pi: Math.PI,
                        e: Math.E,
                        ...data // Add all data to scope as well, just in case
                    };
                    for (const id of dataIds) {
                        scope[id] = data[id] ?? (Math.random() * 100); // Random data fallback
                    }

                    value = evaluate(processedExpression, scope);
                    
                    if (isNaN(value) || !isFinite(value)) {
                        value = 0;
                    }
                } catch (e) {
                    console.error("Error evaluating expression:", e);
                    value = 0;
                }
            }
        } else if (props.dataId) {
            // Fallback for legacy or other widgets
            value = data[props.dataId] ?? (Math.random() * 100);
        }
    return {...instance.fromDB(widget), value} as IWidget
    });
}













