import React from "react";
import Input from "./Input";
import Button from "./Button";

const NewNoteModal = ({ newNote, setNewNote, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-custom-blue">Create New Note</h2>
        <Input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          className="w-full border p-2 rounded-md"
          placeholder="Content"
          rows="4"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button className="bg-custom-dark-pink text-white" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
export default NewNoteModal;
