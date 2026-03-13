import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Exposes VITE_* env variables to your app
  // No changes needed — Vite reads .env automatically
  server: {
    port: 5173,
  },
});