/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07040d",
        panel: "rgba(255,255,255,0.06)",
        stroke: "rgba(255,255,255,0.12)",
        ink: "rgba(255,255,255,0.92)",
        sub: "rgba(255,255,255,0.62)",
        faint: "rgba(255,255,255,0.45)",
      },
      boxShadow: {
        soft: "0 18px 70px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(168,85,247,0.18), 0 30px 90px rgba(0,0,0,0.55)",
        tile: "0 0 0 1px rgba(168,85,247,0.14), 0 18px 60px rgba(0,0,0,0.55)",
        btn: "0 12px 28px rgba(168,85,247,0.22)",
      },
    },
  },
  plugins: [],
};
