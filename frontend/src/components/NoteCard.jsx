import React, { useState } from "react";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import { Pencil, Star, Trash2 } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

const NoteCard = ({ note, onClick = () => {}, onEdit, onDelete, onStar }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-neutral-50 shadow-md p-4 hover:shadow-lg transition-shadow border-l-8 cursor-pointer flex flex-col justify-between h-52"
      style={{ borderLeftColor: note.color }}
    >
      {showConfirmation && (
        <ConfirmationModal
          type="delete"
          onConfirm={() => {
            onDelete();
            setShowConfirmation(false);
          }}
          onCancel={(e) => {
            e.stopPropagation();
            setShowConfirmation(false);
          }}
        />
      )}

      <div>
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-jersey text-xl text-custom-brown truncate">
            {note.title || " "}
          </h2>
        </div>

        <p
          className="text-gray-600 font-mono mb-2 h-14 overflow-hidden break-words editor-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }}
        />

        {note.tags?.length > 0 && (
          <div className="overflow-hidden whitespace-nowrap text-ellipsis">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-custom-light-pink text-custom-dark-pink px-2 py-0.5 mr-1 rounded-full text-xs font-semibold font-mono inline-block"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t flex justify-between items-center text-xs text-gray-400">
        <span>{format(new Date(note.updatedAt), "dd MMM yyyy, hh:mm a")}</span>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-custom-light-pink hover:text-custom-dark-pink"
          >
            <Pencil />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirmation(true);
            }}
            className="text-custom-light-pink hover:text-red-500"
          >
            <Trash2 />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStar();
            }}
            className="text-custom-light-pink hover:text-yellow-500"
          >
            <Star
              className={
                note.isFavorite
                  ? "fill-custom-yellow text-custom-yellow hover:fill-none hover:text-custom-light-pink "
                  : ""
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
