/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        tiny: ['"Tiny5"', "sans-serif"],
        jersey: ['"Jersey 15"', "sans-serif"],
      },
      colors: {
        "custom-dark-pink": "#b83556",
        "custom-light-pink": "#dc97a5",
        "custom-blue": "#55768c",
        "custom-offwhite": "#faded2",
        "custom-brown": "#845747",
        "custom-yellow": "#fed385",
        "custom-red": "#b72b2c",
      },
    },
  },
  plugins: [],
};
