import toast from "react-hot-toast";
import noteService from "../services/noteService";

export const handleCreateNote = async (
  newNote,
  setNotes,
  setShowCreateModal
) => {
  const token = localStorage.getItem("token");
  if (token && newNote.title) {
    if (!newNote.content?.trim()) {
      toast.error("Please add content to the note");
      return;
    }
    try {
      const created = await noteService.createNote(newNote, token);

      if (created && created.title) {
        setNotes((prev) => [...prev, created]);
        setShowCreateModal(false);
        toast.success("New note created successfully");
      } else {
        toast.error("Note creation failed");
        console.error("Note creation failed: ", created);
      }
    } catch (err) {
      console.error("Error creating note:", err.message);
    }
  }
};

export const handleDeleteNote = async (noteId, setNotes) => {
  const token = localStorage.getItem("token");
  if (!token || !noteId) return;
  try {
    const deleted = await noteService.deleteNote(noteId, token);
    if (deleted) {
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
    } else {
      console.error("Failed to delete note");
    }
  } catch (err) {
    console.error("Error creating note:", err.message);
  }
};

export const handleUpdateNote = async (
  noteId,
  updatedNoteData,
  setNotes,
  setShowEditModal,
  setSelectedNote
) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const updatedNote = await noteService.updateNote(
        noteId,
        updatedNoteData,
        token
      );
      if (updatedNote) {
        setNotes((prev) =>
          prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
        );
      }
      setShowEditModal(false);
      setSelectedNote(null);
    } catch (err) {
      console.error("Error creating note:", err.message);
    }
  }
};

export const handleToggleFavorite = async (noteId, setNotes) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const updatedNote = await noteService.toggleFavorite(noteId, token);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
    toast.success(`Note ${updatedNote.isFavorite ? "Starred" : "Unstarred"}`);
  } catch (err) {
    console.error(err);
    toast.error("Error starring note");
  }
};

export const handleToggleArchive = async (noteId, setNotes) => {
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
      `Note ${updatedNote.isArchived ? "Archived" : "Unarchived"} Successfully`
    );
  } catch (err) {
    console.error(err);
    toast.error("Error archiving note");
  }
};

export const handleApplyFilters = async (
  filters,
  setNotes,
  setShowFilterModal
) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  const filteredNotes = await noteService.getFilteredNotes(filters, token);
  setNotes(filteredNotes);
  setShowFilterModal(false);
};
