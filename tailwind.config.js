/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D62839",
        primaryDeep: "#A31621",
        inkbg: "#F7F7F8",
        inkline: "#E4E5E8",
        ink: "#1F2328",
        slateg: "#767B85",
      },
    },
  },
  plugins: [],
};
