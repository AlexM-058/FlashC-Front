import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // <- IMPORTANT pentru Netlify
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:3000", // Schimbă portul dacă backendul tău rulează pe alt port
    },
  },
});
