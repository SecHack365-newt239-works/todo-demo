import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  server: {
    host: true,
    strictPort: true,
    port: 8000,
  },
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "src"),
    },
  },
});
