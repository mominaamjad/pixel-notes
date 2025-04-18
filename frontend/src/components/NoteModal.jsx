import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import noteService from "../services/noteService";
import Button from "./Button";

const NoteModal = ({ noteId, onClose }) => {
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      const token = localStorage.getItem("token");
      if (noteId && token) {
        const fetchedNote = await noteService.getNoteById(noteId, token);
        setNote(fetchedNote);
      }
    };

    fetchNote();
  }, [noteId]);

  if (!note) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        className="bg-custom-offwhite p-6 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-l-8 space-y-4"
        style={{ borderLeftColor: note.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-jersey font-bold text-custom-brown border-b border-custom-brown pb-2">
          {note.title || "Untitled"}
        </h2>

        <div className="text-gray-800 whitespace-normal break-words font-mono text-sm leading-relaxed px-1 editor-content">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(note.content),
            }}
          ></div>
        </div>
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-custom-light-pink text-custom-dark-pink px-3 py-1 rounded-full text-xs font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button
            onClick={onClose}
            className="bg-custom-brown text-white hover:bg-opacity-90"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
