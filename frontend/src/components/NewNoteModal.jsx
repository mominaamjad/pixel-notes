import React, { useState } from "react";
import HTMLEditor from "react-simple-wysiwyg";
import Button from "./Button";
import { Plus } from "lucide-react";

const ColorOption = ({ color, selected, onClick }) => (
  <div
    className={`w-5 h-5  cursor-pointer transition-all ${
      selected
        ? "shadow-[inset_-2.5px_-2.5px_0_0_rgba(0,0,0,0.3),inset_2.5px_2.5px_0_0_rgba(255,255,255,0.5)] transform scale-110"
        : ""
    }`}
    style={{ backgroundColor: color }}
    onClick={() => onClick(color)}
  />
);

const Tag = ({ text, onRemove }) => (
  <div className="flex items-center bg-custom-light-pink rounded-full px-3 py-1 mr-2 mb-2">
    <span className="text-sm text-custom-dark-pink">{text}</span>
    <button
      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      onClick={onRemove}
    >
      ×
    </button>
  </div>
);

const NewNoteModal = ({ newNote, setNewNote, onClose, onSave }) => {
  const [tagInput, setTagInput] = useState("");

  const handleContentChange = (e) => {
    setNewNote({ ...newNote, content: e.target.value });
  };

  const handleColorSelect = (color) => {
    setNewNote({ ...newNote, color });
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag) => {
    // Don't add if tag already exists
    if (!newNote.tags || !newNote.tags.includes(tag)) {
      setNewNote({
        ...newNote,
        tags: [...(newNote.tags || []), tag],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setNewNote({
      ...newNote,
      tags: (newNote.tags || []).filter((tag) => tag !== tagToRemove),
    });
  };

  const colorOptions = [
    "#FAEDCB", // Pale yellow
    "#C9E4DE", // Mint green
    "#C6DEF1", // Light blue
    "#DBCDF0", // Light purple
    "#F2C6DE", // Light pink
    "#F7D9C4", // Light orange
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4">
        <h2 className="text-xl font-bold font-pixel text-custom-dark-pink">
          Create New Note
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="w-full h-10 px-2 border border-custom-brown rounded focus:outline-none focus:border-custom-dark-pink"
        />

        <div className="editor-wrapper">
          <HTMLEditor
            value={newNote.content || ""}
            onChange={handleContentChange}
            className="min-h-36 editor-content"
          />
        </div>

        <div className="space-y-2 flex justify-between pb-3 border-b">
          <p className="text-sm font-medium text-gray-700">Color</p>
          <div className="flex items-center space-x-3">
            {colorOptions.map((color) => (
              <ColorOption
                key={color}
                color={color}
                selected={newNote.color === color}
                onClick={handleColorSelect}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Tags</p>
          <div className="flex flex-wrap">
            {(newNote.tags || []).map((tag) => (
              <Tag key={tag} text={tag} onRemove={() => removeTag(tag)} />
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Enter tags"
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              className="w-full h-8 px-2 border border-custom-brown rounded focus:outline-none focus:border-custom-dark-pink"
            />
            <Button
              className="ml-2 bg-custom-dark-pink text-white hover:bg-gray-300"
              onClick={() => tagInput.trim() && addTag(tagInput.trim())}
            >
              <Plus size={18} />
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            className="bg-white text-custom-dark-pink hover:bg-custom-light-pink"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-white text-custom-dark-pink hover:bg-custom-light-pink"
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewNoteModal;
