import React from "react";

const Input = ({
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder = "",
  error = "",
  required = false,
  autoComplete = "off",
  leftIcon = null,
}) => {
  return (
    <div className="relative w-full flex items-center">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-custom-brown pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`text-base w-full px-3 py-2 h-11 font-mono ${
          leftIcon ? "pl-[2.5rem]" : "pl-3"
        } border-2 shadow-md rounded-sm ${
          error ? "border-red-500" : "border-custom-brown"
        } font-jersey text-slate-700 focus:outline-none focus:border-custom-dark-pink `}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-tiny">{error}</p>}
    </div>
  );
};

export default Input;
