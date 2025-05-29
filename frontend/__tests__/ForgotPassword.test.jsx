import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../src/services/authService";
import ForgotPassword from "../src/pages/ForgotPassword";

vi.mock("../src/services/authService");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-hot-toast", () => ({
  default: {
    loading: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
  },
  __esModule: true,
}));

vi.mock("../src/components/Input", () => ({
  default: ({ type, id, name, value, onChange, placeholder, autoComplete }) => (
    <input
      data-testid={id || name}
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
  ),
}));

vi.mock("../src/components/Button", () => ({
  default: ({ children, type, className, style, onClick }) => (
    <button
      data-testid="button"
      type={type}
      className={className}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe("ForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    authService.forgotPassword = vi.fn();
  });

  test("renders the forgot password form correctly", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByText("FORGOT PASSWORD")).toBeInTheDocument();
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();
    expect(screen.getByText("Send Reset Link")).toBeInTheDocument();
    expect(screen.getByText("Back to Login")).toBeInTheDocument();
  });

  test("validates email input - invalid email format", async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByTestId("email");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    fireEvent.click(screen.getByTestId("button"));

    expect(screen.getByText("Email is invalid")).toBeInTheDocument();

    expect(authService.forgotPassword).not.toHaveBeenCalled();
  });

  test("submits form with valid email and handles success response", async () => {
    authService.forgotPassword.mockResolvedValueOnce({ status: "success" });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByTestId("email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    fireEvent.click(screen.getByTestId("button"));

    expect(toast.loading).toHaveBeenCalledWith("Sending reset link ...");

    await waitFor(() => {
      expect(authService.forgotPassword).toHaveBeenCalledWith({
        email: "test@example.com",
      });

      expect(toast.dismiss).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Reset link sent to email");

      expect(
        screen.getByText("Reset link sent. Please check your email :)")
      ).toBeInTheDocument();

      expect(screen.queryByTestId("email")).not.toBeInTheDocument();
    });
  });

  test("navigates to login page when 'Back to Login' is clicked", () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Back to Login"));

    expect(screen.getByText("Back to Login").closest("a")).toHaveAttribute(
      "href",
      "/login"
    );
  });
});
