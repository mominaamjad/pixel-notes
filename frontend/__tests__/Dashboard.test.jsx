import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import Dashboard from "../src/pages/Dashboard";
import noteService from "../src/services/noteService";
import * as noteHandlers from "../src/utils/noteHandlers";

vi.mock("../src/services/noteService");
vi.mock("../src/utils/noteHandlers");

vi.mock("../src/components", () => ({
  PixelLoader: () => <div data-testid="loader">Loading...</div>,
  NavBar: () => <nav data-testid="navbar">Nav Bar</nav>,
  Input: ({ leftIcon, ...props }) => (
    <div>
      {leftIcon}
      <input data-testid="input" {...props} />
    </div>
  ),
  Button: ({ children, ...props }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
  NoteCard: ({ note, onClick, onEdit, onDelete, onStar }) => (
    <div data-testid={`note-card-${note._id}`} className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={onClick} data-testid={`view-note-${note._id}`}>
        View
      </button>
      <button onClick={onEdit} data-testid={`edit-note-${note._id}`}>
        Edit
      </button>
      <button onClick={onDelete} data-testid={`delete-note-${note._id}`}>
        Delete
      </button>
      <button onClick={onStar} data-testid={`star-note-${note._id}`}>
        Star
      </button>
    </div>
  ),
  NoteViewModal: ({ noteId, onClose, onArchive }) => (
    <div data-testid="view-modal">
      <p>Viewing note {noteId}</p>
      <button onClick={onClose} data-testid="close-view-modal">
        Close
      </button>
      <button onClick={onArchive} data-testid="archive-note">
        Archive
      </button>
    </div>
  ),
  NoteModal: ({ mode, noteId, onClose, onSave }) => (
    <div data-testid={`${mode}-modal`}>
      <p>{mode === "new" ? "Creating new note" : `Editing note ${noteId}`}</p>
      <button onClick={onClose} data-testid={`close-${mode}-modal`}>
        Close
      </button>
      <button
        onClick={() => onSave({ title: "Test Note", content: "Test Content" })}
        data-testid={`save-${mode}-note`}
      >
        Save
      </button>
    </div>
  ),
  FilterModal: ({ onApply, onClear, onClose }) => (
    <div data-testid="filter-modal">
      <p>Filter Modal</p>
      <button onClick={onApply} data-testid="apply-filters">
        Apply
      </button>
      <button onClick={onClear} data-testid="clear-filters">
        Clear
      </button>
      <button onClick={onClose} data-testid="close-filter-modal">
        Close
      </button>
    </div>
  ),
}));

const mockNotes = [
  {
    _id: "1",
    title: "Test Note 1",
    content: "This is test note 1",
    favorite: false,
  },
  {
    _id: "2",
    title: "Test Note 2",
    content: "This is test note 2",
    favorite: true,
  },
];

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "fake-token"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    noteService.getNotes = vi.fn().mockResolvedValue(mockNotes);

    vi.mock("../src/utils/noteHandlers", () => ({
      handleCreateNote: vi
        .fn()
        .mockImplementation((noteData, setNotes, setShowCreateModal) => {
          setNotes((prevNotes) => [...prevNotes, { _id: "3", ...noteData }]);
          setShowCreateModal(false);
        }),

      handleDeleteNote: vi.fn().mockImplementation((noteId, setNotes) => {
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );
      }),

      handleUpdateNote: vi
        .fn()
        .mockImplementation(
          (
            selectedNote,
            updatedNoteData,
            setNotes,
            setShowEditModal,
            setSelectedNote
          ) => {
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note._id === selectedNote
                  ? { ...note, ...updatedNoteData }
                  : note
              )
            );
            setShowEditModal(false);
            setSelectedNote(null);
          }
        ),

      handleToggleFavorite: vi.fn(),
      handleToggleArchive: vi.fn(),
      handleApplyFilters: vi.fn(),
    }));
  });

  test("renders notes after loading", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("note-card-2")).toBeInTheDocument();
    });

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("input")).toBeInTheDocument();
    expect(screen.getAllByTestId("button").length).toBeGreaterThan(0);
  });

  test("filters notes based on search query", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("input");
    fireEvent.change(searchInput, { target: { value: "Test Note 1" } });

    expect(screen.getByText("Test Note 1")).toBeInTheDocument();
  });

  test("opens and closes create note modal", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
    });

    const buttons = screen.getAllByTestId("button");
    const createButton = buttons[1];
    fireEvent.click(createButton);

    expect(screen.getByTestId("new-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-new-modal"));

    expect(screen.queryByTestId("new-modal")).not.toBeInTheDocument();
  });

  test("opens view note modal when note is clicked", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("view-note-1"));

    expect(screen.getByTestId("view-modal")).toBeInTheDocument();
    expect(screen.getByText("Viewing note 1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-view-modal"));

    expect(screen.queryByTestId("view-modal")).not.toBeInTheDocument();
  });

  test("opens edit note modal and updates note", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("edit-note-1"));

    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    expect(screen.getByText("Editing note 1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("save-edit-note"));

    await waitFor(() => {
      expect(screen.queryByTestId("edit-modal")).not.toBeInTheDocument();
      expect(noteHandlers.handleUpdateNote).toHaveBeenCalled();
    });
  });

  test("deletes a note", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("delete-note-1"));

    expect(noteHandlers.handleDeleteNote).toHaveBeenCalledWith(
      "1",
      expect.any(Function)
    );
  });

  test("toggles favorite status of a note", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("star-note-1"));

    expect(noteHandlers.handleToggleFavorite).toHaveBeenCalledWith(
      "1",
      expect.any(Function)
    );
  });

  test("opens filter modal and applies filters", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
    });

    const buttons = screen.getAllByTestId("button");
    const filterButton = buttons[0];
    fireEvent.click(filterButton);

    expect(screen.getByTestId("filter-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("apply-filters"));

    expect(noteHandlers.handleApplyFilters).toHaveBeenCalled();
  });

  test("archives a note", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("note-card-1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("view-note-1"));

    fireEvent.click(screen.getByTestId("archive-note"));

    expect(noteHandlers.handleToggleArchive).toHaveBeenCalledWith(
      "1",
      expect.any(Function)
    );
  });
});
