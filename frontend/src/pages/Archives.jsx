import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import noteService from "../services/noteService";
import Navbar from "../components/NavBar";
import PixelLoader from "../components/PixelLoader";
import ConfirmationModal from "../components/ConfirmationModal";
import { ArchiveX, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Archives = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [showArchiveConfirmation, setShowArchiveConfirmation] = useState(false);
  const [noteToToggleArchive, setNoteToToggleArchive] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchArchivedNotes = async () => {
      let token = localStorage.getItem("token");
      if (token) {
        try {
          setLoading(true);
          const fetchedNotes = await noteService.getArchivedNotes(token);
          setNotes(fetchedNotes || []);
        } catch (err) {
          console.error("Could not load notes", err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArchivedNotes();
  }, []);

  const handleDeleteNote = async (noteId) => {
    const token = localStorage.getItem("token");
    if (!token || !noteId) return;

    const deleted = await noteService.deleteNote(noteId, token);
    if (deleted) {
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } else {
      console.error("Failed to delete note");
    }
  };

  const handleArchiveToggle = async (noteId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const updatedNote = await noteService.toggleArchive(noteId, token);
      setNotes((prevNotes) =>
        updatedNote.isArchived
          ? prevNotes.map((note) =>
              note._id === updatedNote._id ? updatedNote : note
            )
          : prevNotes.filter((note) => note._id !== updatedNote._id)
      );
      toast.success(
        `Note ${
          updatedNote.isArchived ? "Archived" : "Unarchived"
        } Successfully`
      );
    } catch (err) {
      console.error(err);
      toast.error("Error archiving note");
    }
  };

  if (loading) return <PixelLoader />;

  return (
    <div>
      {showConfirmation && noteToDelete && (
        <ConfirmationModal
          type="delete"
          onConfirm={() => {
            handleDeleteNote(noteToDelete);
            setShowConfirmation(false);
            setNoteToDelete(null);
          }}
          onCancel={(e) => {
            e.stopPropagation();
            setShowConfirmation(false);
            setNoteToDelete(null);
          }}
        />
      )}

      {showArchiveConfirmation && noteToToggleArchive && (
        <ConfirmationModal
          type="archive"
          onConfirm={() => {
            handleArchiveToggle(noteToToggleArchive);
            setShowArchiveConfirmation(false);
            setNoteToToggleArchive(null);
          }}
          onCancel={(e) => {
            e.stopPropagation();
            setShowArchiveConfirmation(false);
            setNoteToToggleArchive(null);
          }}
        />
      )}

      <Navbar />

      <h1 className="text-center text-custom-brown text-xl font-pixel my-6">
        archives
      </h1>
      <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((note) => (
          <div key={note._id} className={`p-4 shadow bg-white`}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-jersey text-xl text-custom-brown truncate">
                  {note.title || " "}
                </h2>
              </div>

              <p
                className="text-gray-600 font-mono mb-2 h-14 overflow-hidden break-words editor-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(note.content),
                }}
              />
            </div>

            <div className="flex justify-end items-center pt-4 border-t space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNoteToToggleArchive(note._id);
                  setShowArchiveConfirmation(true);
                }}
                className="text-custom-light-pink hover:text-custom-dark-pink"
              >
                <ArchiveX />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNoteToDelete(note._id);
                  setShowConfirmation(true);
                }}
                className="text-custom-light-pink hover:text-red-500"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archives;
