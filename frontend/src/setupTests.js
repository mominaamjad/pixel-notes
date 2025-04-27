import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}

if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder;
}

afterEach(() => {
  cleanup();
});
