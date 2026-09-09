import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF7F1",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#201E1B",
          muted: "#7A7265",
          faint: "#A69E90",
        },
        border: {
          DEFAULT: "#E8E1D3",
          strong: "#D8CEBB",
        },
        brand: {
          DEFAULT: "#C6790C",
          hover: "#AD6708",
          tint: "#F6E4C1",
          text: "#7A4B08",
        },
        money: {
          DEFAULT: "#146B54",
          hover: "#0F5744",
          tint: "#DCEEE7",
          text: "#0F5744",
        },
        clay: {
          DEFAULT: "#B14328",
          hover: "#953620",
          tint: "#F3DDD5",
          text: "#8A3420",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(32, 30, 27, 0.04)",
      },
      keyframes: {
        "sheet-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pop": {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "sheet-up": "sheet-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fade-in 0.2s ease-out",
        "pop": "pop 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
