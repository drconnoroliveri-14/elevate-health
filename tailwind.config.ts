import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#E6E7D7",
        onyx: "#000000",
        slate: "#A09F93",
        sand: "#DBC6A1",
        ember: "#FF5740",
        ice: "#6AB9DF",
      },
      fontFamily: {
        heading: ["Galano Grotesque", "Inter", "sans-serif"],
        body: ["Apercu Pro", "Inter", "sans-serif"],
        accent: ["Loretta Light", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
