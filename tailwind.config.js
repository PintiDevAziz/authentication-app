/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        header: "#333",
        themeBlue: "#2f80ed",
        borderGray: "#bdbdbd",
        textGray: "#828282",
      },
    },
  },
  plugins: [],
};
