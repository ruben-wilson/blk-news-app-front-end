import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/feed": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
      // optional: if you ever want to hit these from the frontend
      "/rss": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
