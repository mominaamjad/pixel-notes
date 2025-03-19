import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import this to use toBeInTheDocument
import App from "../src/App.jsx";

test("renders Vite + React heading", () => {
  render(<App />);
  const heading = screen.getByText(/Vite \+ React/i);
  expect(heading).toBeInTheDocument();
});
