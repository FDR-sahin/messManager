/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF4FF",
          100: "#D9E6FF",
          200: "#B3CCFF",
          300: "#7FA6FF",
          400: "#4C7FFF",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
          800: "#1E3A8A",
          900: "#172554",
        },
        slate2: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          400: "#94A3B8",
          600: "#475569",
          800: "#1E293B",
          900: "#0F172A",
        },
        accent: {
          green: "#10B981",
          red: "#EF4444",
          amber: "#F59E0B",
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
