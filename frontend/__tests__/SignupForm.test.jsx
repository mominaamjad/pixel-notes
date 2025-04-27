import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import SignupForm from "../src/pages/SignupForm";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSignup = vi.fn();
let mockLoading = false;
let mockError = null;

vi.mock("../src/hooks/useAuth", () => ({
  default: () => ({
    signup: mockSignup,
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

const renderSignupForm = () => {
  return render(
    <MemoryRouter>
      <SignupForm />
    </MemoryRouter>
  );
};

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockSignup.mockReset();
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

  test("renders signup form correctly", () => {
    renderSignupForm();

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test("validates form and shows errors on empty submission", async () => {
    renderSignupForm();

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please confirm your password/i)
      ).toBeInTheDocument();
    });

    expect(mockSignup).not.toHaveBeenCalled();
  });

  test("submits form with valid data", async () => {
    mockSignup.mockResolvedValueOnce(true);
    renderSignupForm();

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { name: "name", value: "Test User" },
    });

    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { name: "email", value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { name: "confirmPassword", value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
    });
  });

  test("redirects to dashboard if token exists", () => {
    window.localStorage.getItem.mockReturnValueOnce("fake-token");
    renderSignupForm();

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
