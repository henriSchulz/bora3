import { TextWidet } from "@/types/widgets";



export default function TextWidgetComponent({widget}: {widget: TextWidet}) {


    return <div>{widget.textContent}</div>;

}