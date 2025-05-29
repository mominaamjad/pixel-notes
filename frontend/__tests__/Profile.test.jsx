// Profile.test.jsx
import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import authService from "../src/services/authService";
import useAuth from "../src/hooks/useAuth";
import * as noteHandlers from "../src/utils/noteHandlers";
import Profile from "../src/pages/Profile";

// Mock the services and hooks
vi.mock("../src/services/authService");
vi.mock("../src/utils/noteHandlers");
vi.mock("../src/hooks/useAuth");
vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
  __esModule: true,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the components
vi.mock("../src/components", () => ({
  PixelLoader: () => <div data-testid="loader">Loading...</div>,
  NavBar: () => <nav data-testid="navbar">Nav Bar</nav>,
  PixelMenu: ({ options, onSelect }) => (
    <div data-testid="pixel-menu">
      {options.map((option) => (
        <button
          key={option}
          data-testid={`menu-option-${option
            .replace(/\s+/g, "-")
            .toLowerCase()}`}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  ),
  ConfirmationModal: ({ type, onConfirm, onCancel }) => (
    <div data-testid={`confirmation-modal-${type}`}>
      <p>Are you sure?</p>
      <button onClick={onConfirm} data-testid="confirm-button">
        Yes
      </button>
      <button onClick={onCancel} data-testid="cancel-button">
        No
      </button>
    </div>
  ),
  UpdatePasswordModal: ({ onCancel }) => (
    <div data-testid="update-password-modal">
      <p>Update Password Form</p>
      <button onClick={onCancel} data-testid="close-password-modal">
        Close
      </button>
    </div>
  ),
  ExportOptionsModal: ({ onExport, onClose }) => (
    <div data-testid="export-options-modal">
      <button onClick={() => onExport("txt")} data-testid="export-txt">
        Export as TXT
      </button>
      <button onClick={() => onExport("csv")} data-testid="export-csv">
        Export as CSV
      </button>
      <button onClick={onClose} data-testid="close-export-modal">
        Close
      </button>
    </div>
  ),
}));

// Sample user data for testing
const mockUser = {
  name: "Test User",
  email: "test@example.com",
};

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => "fake-token"),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    // Mock useAuth hook
    useAuth.mockReturnValue({
      logout: vi.fn(),
    });

    // Mock service functions
    authService.getUserProfile = vi.fn().mockResolvedValue(mockUser);

    // Properly mock the handler function
    vi.mocked(noteHandlers.handleExportNotes).mockResolvedValue(true);
  });

  test("fetches and displays user profile", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    // Check if API was called with the token
    expect(authService.getUserProfile).toHaveBeenCalledWith("fake-token");
  });

  test("opens update password modal", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    // Click on update password option
    fireEvent.click(screen.getByTestId("menu-option-update-password"));

    // Check if update password modal is shown
    expect(screen.getByTestId("update-password-modal")).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByTestId("close-password-modal"));

    // Modal should be closed
    expect(
      screen.queryByTestId("update-password-modal")
    ).not.toBeInTheDocument();
  });

  test("opens export options modal", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    // Click on export notes option
    fireEvent.click(screen.getByTestId("menu-option-export-notes"));

    // Check if export options modal is shown
    expect(screen.getByTestId("export-options-modal")).toBeInTheDocument();

    // Close the modal
    fireEvent.click(screen.getByTestId("close-export-modal"));

    // Modal should be closed
    expect(
      screen.queryByTestId("export-options-modal")
    ).not.toBeInTheDocument();
  });

  test("shows logout confirmation modal", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    // Click on logout option
    fireEvent.click(screen.getByTestId("menu-option-logout"));

    // Check if confirmation modal is shown
    expect(screen.getByTestId("confirmation-modal-logout")).toBeInTheDocument();
  });

  test("logs out and navigates to login when confirmed", async () => {
    // Define mockNavigate before using it
    // const mockNavigate = vi.fn();

    // Mock useNavigate
    // vi.mock(
    //   "react-router-dom",
    //   async () => {
    //     const actual = await vi.importActual("react-router-dom");
    //     return {
    //       ...actual,
    //       useNavigate: () => mockNavigate,
    //     };
    //   },
    //   { virtual: true }
    // ); // Add virtual flag to prevent issues

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Wait for profile to load
    await waitFor(() => {
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    });

    // Click on logout option
    fireEvent.click(screen.getByTestId("menu-option-logout"));

    // Click confirm in confirmation modal
    fireEvent.click(screen.getByTestId("confirm-button"));

    // Logout function should be called
    expect(useAuth().logout).toHaveBeenCalled();

    // Should navigate to login page
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
