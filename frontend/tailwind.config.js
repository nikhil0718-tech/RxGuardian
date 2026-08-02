/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0BA5A4",
        secondary: "#119DD8",
        accent: "#2563EB"
      },

      backgroundImage: {
        rxgradient:
          "linear-gradient(to right,#0BA5A4,#119DD8,#2563EB)"
      }
    }
  },

  plugins: []
};