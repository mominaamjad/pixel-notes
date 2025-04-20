import React from "react";
import { useNavigate } from "react-router-dom";
import { PixelMenu } from "../components";

const Landing = () => {
  const navigate = useNavigate();

  const handleSelect = (option) => {
    const route = option.toLowerCase();
    navigate(`/${route}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen fixed inset-0 overflow-hidden z-0">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-custom-yellow"
        style={{
          backgroundColor: "#ffb84d",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-25 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center space-y-6 font-jersey">
        <img
          src="/assets/pixel-logo.png"
          alt="Pixel Notes Logo"
          className="h-32 mx-auto animate-bounce"
        />
        <h1 className="text-4xl md:text-4xl font-bold font-pixel text-white drop-shadow-lg tracking-wide">
          PIXEL NOTES
        </h1>
        <p className="text-white font-mono text-sm md:text-base drop-shadow-md">
          Start your note-taking adventure!
        </p>

        <PixelMenu options={["Login", "Signup"]} onSelect={handleSelect} />
      </div>
    </div>
  );
};

export default Landing;
