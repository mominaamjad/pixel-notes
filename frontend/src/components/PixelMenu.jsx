import React, { useEffect, useState } from "react";

const PixelMenu = ({ options }) => {
  //   const options = ["Export Notes", "Logout"];
  const [selected, setSelected] = useState(0);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelected((prev) => (prev + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      setSelected((prev) => (prev - 1 + options.length) % options.length);
    } else if (e.key === "Enter") {
      if (selected === 0) {
        console.log("Exporting notes...");
        // Call export handler here
      } else {
        console.log("Logging out...");
        // Call logout handler here
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <div>
      {/* className="bg-sky-300 p-8 border-4 border-black w-64 mx-auto mt-20 font-jersey text-white text-2xl shadow-[6px_6px_0_#000000]" */}
      {/* <h1 className="text-3xl mb-4 text-center text-white drop-shadow-[2px_2px_#000]">
        START
      </h1> */}
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
