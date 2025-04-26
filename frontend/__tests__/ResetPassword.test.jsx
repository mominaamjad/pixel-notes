import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../src/services/authService";
import ResetPassword from "../src/pages/ResetPassword";

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
    success: vi.fn(),
    error: vi.fn(),
  },
  __esModule: true,
}));

vi.mock("lucide-react", () => ({
  EyeIcon: () => <div data-testid="eye-icon">Eye Icon</div>,
  EyeOffIcon: () => <div data-testid="eye-off-icon">Eye Off Icon</div>,
}));

vi.mock("../src/components/Input", () => ({
  default: ({ type, id, name, value, onChange, placeholder }) => (
    <input
      data-testid={id || name}
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

vi.mock("../src/components/Button", () => ({
  default: ({ children, type, className, fullWidth, onClick }) => (
    <button
      data-testid="button"
      type={type}
      className={className}
      style={fullWidth ? { width: "100%" } : {}}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

describe("ResetPassword", () => {
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

    delete window.location;
    window.location = {
      search: "?token=valid-token",
    };

    authService.resetPassword = vi.fn();
  });

  test("renders the reset password form correctly", () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.getByText("RESET PASSWORD")).toBeInTheDocument();
    expect(screen.getByText("Enter your new password")).toBeInTheDocument();
    expect(screen.getByTestId("password")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-password")).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  test("validates form - empty fields", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId("button"));

    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(
      screen.getByText("Please confirm your password")
    ).toBeInTheDocument();

    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  test("validates form - passwords don't match", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const passwordInput = screen.getByTestId("password");
    const confirmInput = screen.getByTestId("confirm-password");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password456" } });

    fireEvent.click(screen.getByTestId("button"));

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();

    expect(authService.resetPassword).not.toHaveBeenCalled();
  });

  test("submits form with valid data and handles success response", async () => {
    authService.resetPassword.mockResolvedValueOnce({ status: "success" });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const passwordInput = screen.getByTestId("password");
    const confirmInput = screen.getByTestId("confirm-password");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmInput, { target: { value: "newpassword123" } });

    fireEvent.click(screen.getByTestId("button"));

    await waitFor(() => {
      expect(authService.resetPassword).toHaveBeenCalledWith({
        password: "newpassword123",
        confirmPassword: "newpassword123",
        token: "valid-token",
      });

      expect(toast.success).toHaveBeenCalledWith("Password reset successful!");

      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("shows loading state during form submission", async () => {
    authService.resetPassword.mockImplementationOnce(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ status: "success" }), 100);
      });
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const passwordInput = screen.getByTestId("password");
    const confirmInput = screen.getByTestId("confirm-password");

    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmInput, { target: { value: "newpassword123" } });

    fireEvent.click(screen.getByTestId("button"));

    expect(screen.getByText("Reseting...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Reseting...")).not.toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
