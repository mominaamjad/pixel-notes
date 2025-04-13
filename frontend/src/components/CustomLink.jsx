import React from "react";
import { Link } from "react-router-dom";

const CustomLink = ({ to = "/", children }) => {
  return (
    <Link
      to={to}
      className="group relative inline-block text-custom-dark-pink transition-transform duration-300 ease-in-out hover:scale-105 hover:text-custom-brown"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute left-0 bottom-0 h-0.5 w-full bg-custom-brown transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </Link>
  );
};
export default CustomLink;
