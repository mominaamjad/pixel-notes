import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "../src/components/Input";

describe("Input", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      name: "test-input",
      value: "",
      onChange: vi.fn(),
      placeholder: "Enter text",
      ...props,
    };

    const utils = render(<Input {...defaultProps} />);
    const input = screen.getByPlaceholderText(defaultProps.placeholder);
    return { input, ...defaultProps, ...utils };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders input with placeholder", () => {
    const { input } = setup();
    expect(input).toBeInTheDocument();
  });

  test("calls onChange when typing", () => {
    const { input, onChange } = setup();
    fireEvent.change(input, { target: { value: "Hello" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("displays error message when error is provided", () => {
    setup({ error: "This field is required" });
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  });
});
