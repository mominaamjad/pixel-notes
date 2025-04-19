import React, { useEffect, useState } from "react";
import HTMLEditor from "react-simple-wysiwyg";
import { Plus, X } from "lucide-react";
import { colorOptions } from "../utils/colors";
import noteService from "../services/noteService";
import Button from "./Button";
import ColorTile from "./ColorTile";
import TagChip from "./TagChip";

const NoteModal = ({ mode = "new", noteId, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState({
    title: "Untitled",
    content: "",
    tags: [],
    color: "#267A9E",
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (mode === "edit" && noteId) {
      const fetchNote = async () => {
        const token = localStorage.getItem("token");
        if (noteId && token) {
          const fetchedNote = await noteService.getNoteById(noteId, token);
          setNote(fetchedNote);
        }
      };

      fetchNote();
    }
  }, [mode, noteId]);

  const handleChange = (field, value) => {
    setNote((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag) => {
    if (!note.tags.includes(tag)) {
      setNote((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setNote((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async () => {
    console.log("Submitting form");
    setLoading(true);
    try {
      await onSave(note);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (mode === "edit" && !noteId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-[800px] h-[90vh] flex flex-col border-4 border-custom-dark-pink shadow-xl bg-white">
        {/* Header - Matching Color and Close Button Style */}
        <div className="bg-custom-dark-pink text-white px-3 py-2 flex justify-between items-center">
          <h3 className="font-bold font-mono text-sm truncate">
            {mode === "edit" ? "Edit Note" : "Create New Note"}
          </h3>
          <button
            onClick={onClose}
            title="Close"
            className="w-7 h-7 border-white border-2 flex items-center justify-center bg-custom-light-pink"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <h2 className="text-xl font-bold font-pixel text-custom-dark-pink">
            {mode === "edit" ? "Edit Note" : "Create New Note"}
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={note.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full h-10 px-2 border border-custom-brown rounded focus:outline-none focus:border-custom-dark-pink"
          />

          <div className="editor-wrapper">
            <HTMLEditor
              value={note.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="min-h-36 editor-content"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-2 flex justify-between pb-3 border-b">
            <p className="text-sm font-medium text-gray-700">Color</p>
            <div className="flex items-center space-x-3">
              {colorOptions.map((color) => (
                <ColorTile
                  key={color}
                  color={color}
                  selected={note.color === color}
                  onClick={() => handleChange("color", color)}
                />
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Tags</p>
            <div className="flex flex-wrap">
              {note.tags.map((tag) => (
                <TagChip key={tag} text={tag} onRemove={() => removeTag(tag)} />
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
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

          {/* Action Buttons */}
          <div className="flex justify-center gap-2">
            <Button
              className="px-10 bg-white text-custom-dark-pink hover:bg-custom-light-pink"
              onClick={handleSave}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
