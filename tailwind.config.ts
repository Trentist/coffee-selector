import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef7ee",
          100: "#fdedd6",
          200: "#fbd7ac",
          300: "#f8bb77",
          400: "#f5953e",
          500: "#f2751a",
          600: "#e35d10",
          700: "#bc4610",
          800: "#963814",
          900: "#792f14",
        },
      },
      fontFamily: {
        sans: ["var(--font-shaheen)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;