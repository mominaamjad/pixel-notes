// LoginForm.test.jsx
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../src/pages/LoginForm";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogin = vi.fn();
let mockLoading = false;
let mockError = null;

vi.mock("../src/hooks/useAuth", () => ({
  default: () => ({
    login: mockLogin,
    loading: mockLoading,
    error: mockError,
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderLoginForm = () => {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  );
};

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockLogin.mockReset();
    mockLoading = false;
    mockError = null;

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
      },
      writable: true,
    });
  });

  test("renders login form correctly", () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("validates form and shows errors on empty submission", async () => {
    renderLoginForm();

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  test("validates email format", async () => {
    renderLoginForm();

    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), {
      target: { name: "email", value: "invalid-email" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  test("submits form with valid data", async () => {
    mockLogin.mockResolvedValueOnce(true);
    renderLoginForm();

    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), {
      target: { name: "email", value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("shows loading state", () => {
    mockLoading = true;
    renderLoginForm();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("redirects to dashboard if token exists", () => {
    window.localStorage.getItem.mockReturnValueOnce("fake-token");
    renderLoginForm();

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("toggles password visibility", () => {
    renderLoginForm();

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(screen.getByTestId("toggle-password"));
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByTestId("toggle-password"));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
