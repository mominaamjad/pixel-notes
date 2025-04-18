import React, { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import noteService from "../services/noteService";
import PixelLoader from "../components/PixelLoader";
import NavBar from "../components/NavBar";
import Input from "../components/Input";
import Button from "../components/Button";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import NewNoteModal from "../components/NewNoteModal";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [showModal, setShowModal] = useState(false);

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

  const handleCreateNote = async () => {
    const token = localStorage.getItem("token");
    if (token && newNote.title) {
      try {
        const created = await noteService.createNote(newNote, token);

        if (created && created.title) {
          setNotes((prev) => [...prev, created]);
          setShowModal(false);
          setNewNote({ title: "", content: "" });
        } else {
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

  if (loading) return <PixelLoader />;

  return (
    <div>
      <NavBar />

      {selectedNote && (
        <NoteModal
          noteId={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}

      {showModal && (
        <NewNoteModal
          newNote={newNote}
          setNewNote={setNewNote}
          onClose={() => setShowModal(false)}
          onSave={handleCreateNote}
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
            onClick={() => setShowModal(true)}
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
                onClick={() => setSelectedNote(note._id)}
                onDelete={() => handleDeleteNote(note._id)}
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
