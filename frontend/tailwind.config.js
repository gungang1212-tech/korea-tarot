/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0e1a",
          800: "#0d1225",
          700: "#121830",
          600: "#1a2240",
        },
        purple: {
          900: "#1a0a2e",
          800: "#2d1b69",
          700: "#5b21b6",
          600: "#7c3aed",
        },
        gold: {
          400: "#fbbf24",
          300: "#fcd34d",
          200: "#fde68a",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "star": "star 4s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(251, 191, 36, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(251, 191, 36, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
