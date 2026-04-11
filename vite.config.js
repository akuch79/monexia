import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");  // ✅ manually load .env

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "https://monexiabackend.onrender.com/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""), // ✅ strips /api prefix
        },
      },
    },
    build: {
      outDir: "dist",
    },
  };
});