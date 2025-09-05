import { ValueWidget } from "@/types/widgets";
import { FC } from "react";
import { evaluateCondition } from "../_lib/conditions";

const ValueWidgetComponent: FC<{ widget: ValueWidget }> = ({ widget }) => {
  const {
    value,
    textContent,
    unit,
    decimalPlaces = 2,
    fontSize = 16,
    fontWeight = "normal",
    backgroundColor = "transparent",
    defaultTextColor = "black",
    conditions,
  } = widget;

  let textColor = defaultTextColor;
  if (conditions) {
    for (const rule of conditions) {
      if (evaluateCondition(value, rule.condition, rule.value)) {
        textColor = rule.format.color;
        break; 
      }
    }
  }

  // Format the value
  const formattedValue = value.toFixed(decimalPlaces);

  const containerStyle = {
    backgroundColor,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px'
  };

  const textStyle = {
    color: textColor,
    fontSize: `${fontSize}px`,
    fontWeight,
  };

  return (
    <div>
      {textContent && <span style={{...textStyle, fontSize: `${fontSize * 0.8}px`}}>{textContent}</span>}
      <span style={textStyle}>
        {formattedValue} &nbsp;{unit}
      </span>
    </div>
  );
};

export default ValueWidgetComponent;
