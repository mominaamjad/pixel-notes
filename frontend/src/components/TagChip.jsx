import React from "react";

const TagChip = ({ text, onRemove }) => (
  <div className="flex items-center bg-custom-light-pink rounded-full px-3 py-1 mr-2 mb-2">
    <span className="text-sm text-custom-dark-pink">{text}</span>
    <button
      className="ml-2 text-gray-500 hover:text-gray-700"
      onClick={onRemove}
    >
      ×
    </button>
  </div>
);

export default TagChip;
