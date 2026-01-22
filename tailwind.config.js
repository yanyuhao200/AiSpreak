
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./stores/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3A86FF",
        secondary: "#F8F9FA",
        dark: "#212529",
        success: "#4CAF50",
        warning: "#FF9F1C",
        error: "#E63946",
        morning: {
          bg: "#F8F9FA",
          accent: "#FF9F1C"
        },
        evening: {
          bg: "#1a1c1e",
          card: "#26292b",
          accent: "#3A86FF"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      gridTemplateColumns: {
        'dashboard': '1fr 320px',
      }
    },
  },
  plugins: [],
}
