import React from "react";
import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../src/components/Button";

describe("Button", () => {
  const setup = (props) => {
    const utils = render(
      <Button {...props}>{props.children || "Click me"}</Button>
    );
    const button = screen.getByRole("button", {
      name: props.children || /click me/i,
    });
    return {
      button,
      ...utils,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders button with text", () => {
    const { button } = setup({ children: "Press Me" });
    expect(button).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { button } = setup({ onClick });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
