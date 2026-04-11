import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // ✅ Proxy /api calls to your Express backend — no hardcoded localhost URLs needed
    proxy: {
      "/api": {
        target: import.meta.env.VITE_API_URL || "https://monexiabackend.onrender.com/api",
        changeOrigin: true,
      },
    },
  },
});
