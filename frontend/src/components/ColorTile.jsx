import React from "react";

const ColorTile = ({ color, selected, onClick }) => (
  <div
    className={`w-5 h-5 cursor-pointer transition-all ${
      selected
        ? "shadow-[inset_-2.5px_-2.5px_0_0_rgba(0,0,0,0.3),inset_2.5px_2.5px_0_0_rgba(255,255,255,0.5)] transform scale-110"
        : ""
    }`}
    style={{ backgroundColor: color }}
    onClick={() => onClick(color)}
  />
);

export default ColorTile;
