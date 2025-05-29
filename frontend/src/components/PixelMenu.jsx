import React, { useEffect, useState } from "react";

const PixelMenu = ({ options, onSelect }) => {
  const [selected, setSelected] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelected((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      setSelected((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      onSelect(options[selected]);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <div>
      <ul className="space-y-3 text-2xl">
        {options.map((opt, index) => (
          <li
            key={opt}
            className={`flex items-center ${
              selected === index
                ? "text-custom-dark-pink"
                : "text-custom-light-pink"
            }`}
          >
            <span className="w-6">{selected === index ? "▶" : ""}</span>
            {opt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PixelMenu;
