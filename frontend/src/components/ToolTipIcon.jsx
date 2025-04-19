import React from "react";
import { Link } from "react-router-dom";

const ToolTipIcon = ({
  href,
  icon: Icon,
  label,
  color = "hover:text-pink-700",
}) => {
  return (
    <div className="group relative flex flex-col items-center justify-center">
      <Link to={href} className={`${color} transition`}>
        <Icon
          size={30}
          className="transition-transform duration-200 group-hover:scale-125"
        />
      </Link>
      <div
        className="absolute top-14 -translate-y-1/2 ml-2 w-max 
                          bg-gray-800 text-white text-xs font-medium py-1 px-2 
                          rounded-md opacity-0 group-hover:opacity-100 
                          pointer-events-none transition whitespace-nowrap z-10"
      >
        {label}
        <div className="absolute left-1/2 top-0 -translate-y-1/2 -ml-1.5 w-2 h-2 bg-gray-800 rotate-45 z-[-1]"></div>
      </div>
    </div>
  );
};

export default ToolTipIcon;
