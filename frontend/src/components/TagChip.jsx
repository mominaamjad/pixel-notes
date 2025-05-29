import React from "react";

const TagChip = ({ text, onRemove, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={`flex items-center rounded-full px-3 py-1 mr-2 mb-2 ${className}`}
  >
    <span className="text-sm text-custom-dark-pink">{text}</span>
    {onRemove && (
      <button
        className="ml-2 text-gray-500 hover:text-gray-700"
        onClick={(e) => {
          e.stopPropagation(); // prevent bubbling to onClick
          onRemove();
        }}
      >
        ×
      </button>
    )}
  </div>
);

export default TagChip;
