import { React, useState } from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  fullWidth = false,
  className = "",
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };

  const baseStyle = `
    relative px-4 py-2 text-center cursor-pointer select-none border-none
    font-jersey text-base transition-transform duration-100 hover:opacity-40
    [image-rendering:pixelated] focus:outline-none 
    shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.3),inset_4px_4px_0_0_rgba(255,255,255,0.5)]
    [clip-path:polygon(0_4px,4px_0,calc(100%-4px)_0,100%_4px,100%_calc(100%-4px),calc(100%-4px)_100%,4px_100%,0_calc(100%-4px))]
  `;

  const pressedStyle = isPressed
    ? "translate-y-[2px] shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.3),inset_-4px_-4px_0_0_rgba(255,255,255,0.5)]"
    : "";

  const disabledStyle = disabled
    ? "opacity-70 cursor-not-allowed bg-gray-600"
    : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`
        ${baseStyle}
        ${pressedStyle}
        ${disabledStyle}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;
