import React, { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import noteService from "../services/noteService";
import PixelLoader from "../components/PixelLoader";
import NavBar from "../components/NavBar";
import Input from "../components/Input";
import Button from "../components/Button";
import NoteCard from "../components/NoteCard";
import NoteViewModal from "../components/NoteViewModal";
import NoteModal from "../components/NoteModal";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      let token = localStorage.getItem("token");
      if (token) {
        try {
          setLoading(true);
          const fetchedNotes = await noteService.getNotes(token);
          setNotes(fetchedNotes || []);
        } catch (err) {
          console.error("Could not load notes", err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotes();
  }, []);

  const handleCreateNote = async (newNote) => {
    const token = localStorage.getItem("token");
    if (token && newNote.title) {
      console.log("Creating note:", newNote);
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

  const handleUpdateNote = async (updatedNoteData) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const updatedNote = await noteService.updateNote(
          selectedNote,
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

  const handleToggleFavorite = async (noteId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const updatedNote = await noteService.toggleFavorite(noteId, token);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        )
      );
      toast.success(
        `Note ${updatedNote.isFavorite ? "Starred" : "Unstarred"} Successfully`
      );
    } catch (err) {
      console.error(err);
      toast.error("Error starring note");
    }
  };

  if (loading) return <PixelLoader />;

  return (
    <div>
      <NavBar />

      {showViewModal && (
        <NoteViewModal
          noteId={selectedNote}
          onClose={() => {
            setShowViewModal(false);
            setSelectedNote(null);
          }}
        />
      )}

      {showCreateModal && (
        <NoteModal
          mode="new"
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateNote}
        />
      )}

      {showEditModal && (
        <NoteModal
          mode="edit"
          noteId={selectedNote}
          onClose={() => {
            setShowEditModal(false);
            setSelectedNote(null);
          }}
          onSave={handleUpdateNote}
        />
      )}

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center justify-center w-full md:w-1/2">
            <Input
              type="text"
              id="search"
              name="search"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search />}
            />
            <Button
              onClick={() => {}}
              className="ml-2 bg-custom-brown text-white"
            >
              Filter
            </Button>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-custom-dark-pink text-white rounded-lg hover:bg-opacity-90 font-jersey"
          >
            <Plus strokeWidth={3} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {notes
            .filter(
              (note) =>
                note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((note) => (
              <NoteCard
                key={note._id || note.id}
                note={note}
                onClick={() => {
                  setSelectedNote(note._id);
                  setShowViewModal(true);
                }}
                onEdit={() => {
                  setSelectedNote(note._id);
                  setShowEditModal(true);
                }}
                onDelete={() => handleDeleteNote(note._id)}
                onStar={() => handleToggleFavorite(note._id)}
              />
            ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-custom-blue mb-4 font-jersey">
              No notes yet
            </p>
            <p className="text-gray-500 font-mono">
              Create your first note to get started! ✨
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
