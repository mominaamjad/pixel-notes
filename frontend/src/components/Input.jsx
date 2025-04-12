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
}) => {
  return (
    <div className="mb-2 w-full flex items-">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`text-lg w-full px-3 py-2 border-2 shadow-2xl rounded-sm ${
          error ? "border-red-500" : "border-custom-brown"
        } font-jersey text-slate-700 focus:outline-none focus:border-custom-dark-pink `}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-tiny">{error}</p>}
    </div>
  );
};

export default Input;
