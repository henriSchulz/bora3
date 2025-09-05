import {Widget as  PrismaWidget} from "@prisma/client";


// dummy function to simulate fetching data for widgets from Redis

export async function fetchDataForWidgets(widgets: PrismaWidget[]): Promise<Record<string, number>> {
    const data: Record<string, number> = {};
    widgets.forEach(widget => {
        const props = widget.properties as any;
        if (props.dataId) {
            data[props.dataId] = Math.random() * 100;
        }
        if (props.dataIds) {
            props.dataIds.forEach((id: string) => {
                data[id] = Math.random() * 100;
            });
        }
    });
    
    return data;
}