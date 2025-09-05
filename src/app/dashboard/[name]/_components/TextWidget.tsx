import { TextWidget } from "@/types/widgets";
import { FC } from "react";

const TextWidgetComponent: FC<{ widget: TextWidget }> = ({ widget }) => {
  const {
    textContent,
    fontSize = 16,
    fontWeight = "normal",
    backgroundColor = "transparent",
    defaultTextColor = "black",
  } = widget;

  const containerStyle = {
    backgroundColor,
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px'
  };

  const textStyle = {
    color: defaultTextColor,
    fontSize: `${fontSize}px`,
    fontWeight,
  };

  return (
    <div style={containerStyle}>
      <span style={textStyle}>{textContent}</span>
    </div>
  );
};

export default TextWidgetComponent;
