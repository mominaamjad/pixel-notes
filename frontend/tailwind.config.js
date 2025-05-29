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
        "custom-dark-pink": "#aa2f4c", // Slightly deeper for better text contrast
        "custom-light-pink": "#eba2b0", // Softer and more legible on white/dark
        "custom-blue": "#49697f", // Slightly muted, pairs better with pinks/browns
        "custom-offwhite": "#f4eedd", // Neutral and calm off-white, better than faded2 (invalid hex)
        "custom-brown": "#7a4d3f", // Less red, more balanced for bg/text
        "custom-yellow": "#fddc9b", // Softer on eyes, keeps warmth
      },
    },
  },
  plugins: [],
};
