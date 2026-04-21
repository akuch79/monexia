import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "https://monexiabackend.onrender.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    build: {
      outDir: "dist",
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks: {
            react:  ["react", "react-dom", "react-router-dom"],
            charts: ["recharts", "chart.js", "react-chartjs-2"],
            icons:  ["lucide-react", "react-icons"],
            motion: ["framer-motion"],
            ui:     ["react-toastify"],
            utils:  ["axios"],
          },
        },
      },
    },
  };
});