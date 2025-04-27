import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import NoteCard from "../src/components/NoteCard";

const mockNote = {
  title: "Test Note",
  content: "<p>Test Content</p>",
  tags: ["tag1", "tag2"],
  updatedAt: new Date().toISOString(),
  color: "pink",
  isFavorite: false,
};

describe("NoteCard", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      note: mockNote,
      onClick: vi.fn(),
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      onStar: vi.fn(),
      ...props,
    };

    const utils = render(<NoteCard {...defaultProps} />);
    const card = screen.getByText(/test note/i).closest("div");
    return { ...utils, ...defaultProps, card };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders note title, content, and tags", () => {
    setup();

    expect(screen.getByText(/test note/i)).toBeInTheDocument();
    expect(screen.getByText(/test content/i)).toBeInTheDocument();
    expect(screen.getByText(/tag1/i)).toBeInTheDocument();
    expect(screen.getByText(/tag2/i)).toBeInTheDocument();
  });

  test("calls onClick when card is clicked", () => {
    const { card, onClick } = setup();
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalled();
  });

  test("calls onEdit when edit button is clicked", () => {
    const { onEdit } = setup();
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(onEdit).toHaveBeenCalled();
  });

  test("shows confirmation modal when delete button is clicked", () => {
    setup();
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]); // Second button = Trash (delete)

    expect(screen.getByText(/are you sure/i)).toBeInTheDocument(); // Assuming modal has this text
  });

  test("calls onStar when star button is clicked", () => {
    const { onStar } = setup();
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[2]); // Third button = Star (favorite)

    expect(onStar).toHaveBeenCalled();
  });
});
