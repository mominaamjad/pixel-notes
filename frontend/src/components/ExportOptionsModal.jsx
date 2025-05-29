import React from "react";

const ExportOptionsModal = ({ onExport, onClose }) => {
  const formats = ["txt", "csv", "json"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white shadow-lg border-2 font-mono border-custom-brown w-80 max-w-full">
        <div className="bg-custom-brown text-white px-6 py-3 text-sm font-bold">
          Select Export Format
        </div>
        <ul className="divide-y divide-custom-brown">
          {formats.map((format) => (
            <li
              key={format}
              onClick={() => {
                onExport(format);
                onClose();
              }}
              className="px-4 py-3 hover:bg-custom-offwhite cursor-pointer font-mono text-sm"
            >
              {format.toUpperCase()}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full text-center py-2 text-red-500 font-semibold border-t border-custom-brown"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExportOptionsModal;
