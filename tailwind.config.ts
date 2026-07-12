import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF3E7",
        cream2: "#F3E6D3",
        maroon: "#8C2A2A",
        maroonDark: "#6E1F1F",
        gold: "#C79A4B",
        ink: "#3A2B22"
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"]
      }
    }
  },
  plugins: []
};
export default config;
