import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { toast } from "react-hot-toast";
import { Archive, ArchiveX, Download, X } from "lucide-react";
import noteService from "../services/noteService";

const NoteViewModal = ({ noteId, onClose, onArchive }) => {
  const [note, setNote] = useState(null);
  const [showFormatOptions, setShowFormatOptions] = useState(false);
  const formatRef = useRef(null);

  const handleDownloadClick = () => {
    setShowFormatOptions((prev) => !prev);
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formatRef.current && !formatRef.current.contains(e.target)) {
        setShowFormatOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = async (noteId, format = "txt") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await noteService.downloadNote(noteId, format, token);
      const contentType = res.headers["content-type"];
      const blob = new Blob([res.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const disposition = res.headers["content-disposition"];
      const match = disposition?.match(/filename="?(.+)"?/);
      const fileName = match?.[1] || `note-${noteId}.${format}`;

      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Note downloaded as ${format}`);
    } catch (err) {
      console.error("Download failed:", err.message);
    } finally {
      setShowFormatOptions(false);
    }
  };

  if (!note) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[800px] h-[90vh] flex flex-col border-4 shadow-xl bg-white"
        style={{ borderColor: note.color }}
      >
        <div
          className="text-white px-3 py-2 flex justify-between items-center"
          style={{ backgroundColor: note.color }}
        >
          <h3 className="font-bold font-mono text-sm truncate">
            {note.title || "Untitled Note"}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadClick}
              title="Download"
              className="w-7 h-7 border-white border-2 flex items-center justify-center bg-custom-light-pink"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onArchive}
              title={note.isArchived ? "Unarchive" : "Archive"}
              className="w-7 h-7 border-white border-2 flex items-center justify-center bg-custom-light-pink"
            >
              {note.isArchived ? <ArchiveX size={20} /> : <Archive size={20} />}
            </button>
            <button
              onClick={onClose}
              title="Close"
              className="w-7 h-7 border-white border-2 flex items-center justify-center bg-custom-light-pink"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <h2 className="text-3xl font-jersey font-bold border-b border-custom-brown text-custom-brown break-words">
            {note.title || "Untitled"}
          </h2>

          <div className="mt-4 text-gray-800 break-words font-mono text-sm leading-relaxed px-1 editor-content">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(note.content),
              }}
            ></div>
          </div>

          {note.tags?.length > 0 && (
            <div className="mt-4">
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

        {showFormatOptions && (
          <div
            ref={formatRef}
            className="absolute top-12 right-12 z-10 bg-white shadow-md border-2 border-custom-brown"
          >
            <div className="bg-custom-brown text-white px-2 py-1 text-xs font-bold">
              Download Format
            </div>
            <ul>
              {["txt", "csv"].map((format) => (
                <li
                  key={format}
                  onClick={() => handleDownload(noteId, format)}
                  className="px-4 py-2 hover:bg-custom-offwhite cursor-pointer font-mono border-b border-custom-brown text-sm"
                >
                  {format.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteViewModal;
