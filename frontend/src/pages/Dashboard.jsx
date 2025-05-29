import React, { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import noteService from "../services/noteService";
import {
  handleApplyFilters,
  handleCreateNote,
  handleDeleteNote,
  handleToggleArchive,
  handleToggleFavorite,
  handleUpdateNote,
} from "../utils/noteHandlers";
import {
  PixelLoader,
  NavBar,
  Input,
  Button,
  NoteCard,
  NoteViewModal,
  NoteModal,
  FilterModal,
} from "../components";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    tags: [],
    color: "",
    favorite: null,
  });

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

  const onCreate = async (noteData) => {
    await handleCreateNote(noteData, setNotes, setShowCreateModal);
  };

  const onDelete = async (noteId) => {
    await handleDeleteNote(noteId, setNotes);
  };

  const onUpdate = async (updatedNoteData) => {
    await handleUpdateNote(
      selectedNote,
      updatedNoteData,
      setNotes,
      setShowEditModal,
      setSelectedNote
    );
  };

  const onToggleFavorite = async (noteId) => {
    await handleToggleFavorite(noteId, setNotes);
  };

  const onToggleArchive = async (noteId) => {
    await handleToggleArchive(noteId, setNotes);
  };

  const onApplyFilters = async () => {
    await handleApplyFilters(filters, setNotes, setShowFilterModal);
  };

  const handleClearFilters = () => {
    setFilters({
      tags: [],
      color: "",
      favorite: null,
    });
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
          onArchive={() => onToggleArchive(selectedNote)}
        />
      )}

      {showCreateModal && (
        <NoteModal
          mode="new"
          onClose={() => setShowCreateModal(false)}
          onSave={onCreate}
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
          onSave={onUpdate}
        />
      )}

      {showFilterModal && (
        <FilterModal
          selectedFilters={filters}
          setSelectedFilters={setFilters}
          onApply={onApplyFilters}
          onClear={handleClearFilters}
          onClose={() => setShowFilterModal(false)}
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
              onClick={() => setShowFilterModal(true)}
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
                onDelete={() => onDelete(note._id)}
                onStar={() => onToggleFavorite(note._id)}
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
