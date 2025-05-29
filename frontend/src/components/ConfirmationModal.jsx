import React from "react";
import Button from "./Button";

const ConfirmationModal = ({ type, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
    <div className="bg-custom-offwhite border p-6 shadow-xl text-center w-96">
      <p className="mb-4 text-lg text-gray-800 font-semibold font-mono">
        {type == "logout" && "Are you sure you want to log out?"}
        {type == "delete" && "Are you sure you want to delete this note?"}
        {type == "archive" && "Are you sure you want to unarchive this note?"}
      </p>
      <div className="flex justify-center gap-4">
        <Button
          onClick={onCancel}
          className="bg-custom-light-pink w-20 px-4 hover:opacity-70"
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-custom-dark-pink w-20 text-white px-4 hover:opacity-70"
        >
          Yes
        </Button>
      </div>
    </div>
  </div>
);

export default ConfirmationModal;
