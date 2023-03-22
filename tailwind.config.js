/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: {
          xlight: "#e8cc9e",
          light: "#c7ac80",
          medium: "#a1927d",
          dark: "#7a7a7a",
          xdark: "#232323"
        },
        bg: {
          default: "#252628",
          dark: "#202124",
          light: "#2f3136"
        },
        button: {
          special: "#695845",
          neutral: "#1c1d20"
        }
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
};