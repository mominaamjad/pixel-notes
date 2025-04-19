import React, { useEffect, useState } from "react";

const PixelLoader = ({ width = 200, height = 80, barColor = "#b83556" }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 10) return 0;
        return prevProgress + 1;
      });
    }, 250);

    return () => clearInterval(timer);
  }, []);

  const pixelSize = Math.floor(width / 40);
  const fontSize = Math.floor(width / 12);
  const barWidth = Math.floor(width * 0.8);
  const barHeight = Math.floor(height * 0.25);
  const borderThickness = Math.max(2, Math.floor(pixelSize / 2));

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ width: "100%", height: "100%" }}
    >
      <div
        className="flex flex-col items-center justify-center gap-2"
        style={{ width }}
      >
        <div
          className="font-pixel tracking-wider text-black"
          style={{ fontSize }}
        >
          LOADING...
        </div>

        <div
          className="relative flex items-center justify-start bg-white"
          style={{
            width: barWidth,
            height: barHeight,
            border: `${borderThickness}px solid black`,
            padding: borderThickness,
          }}
        >
          <div className="flex h-full">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-full transition-opacity duration-100"
                style={{
                  width: Math.floor((barWidth - 4 * borderThickness) / 11),
                  backgroundColor: barColor,
                  opacity: index < progress ? 1 : 0,
                  marginRight: index < 10 ? borderThickness : 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelLoader;
