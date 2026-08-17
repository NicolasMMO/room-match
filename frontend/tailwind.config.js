/** @type {import('tailwindcss').Config} */
const customTailwindConfig = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f2ff",
          100: "#b3d9ff",
          200: "#80c0ff",
          300: "#4da7ff",
          400: "#1a8eff",
          500: "#005A9C",
          600: "#004a80",
          700: "#003a66",
          800: "#002a4d",
          900: "#001a33",
        },
        accent: {
          50: "#fff5e6",
          100: "#ffe0b3",
          200: "#ffcc80",
          300: "#ffb84d",
          400: "#ffa31a",
          500: "#F57C00",
          600: "#d96d00",
          700: "#bf5e00",
          800: "#a64f00",
          900: "#8c4000",
        },
        background: "#F4F7F6",
        "text-light": "#666",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.06)",
        navbar: "0 2px 4px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

export default customTailwindConfig;
