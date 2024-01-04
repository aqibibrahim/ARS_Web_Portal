/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/react-tailwindcss-select/dist/index.esm.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#1681FF",
          200: "#1691FC",
          300: "#C5DFFF",
          400: "#E3F1FF",
        },
        secondary: {
          100: "#F8F5EF",
        },
        lightGray: {
          100: "#F9FAFC",
        },
        grayBg: {
          100: "#E6ECF2",
          200: "#F3F6F9",
          300: "#F4F5F6",
        },
        offWhiteCustom: {
          100: "#F6F7F7",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
