import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  // server: {
  //   host: "local.myapp.test", // Use your custom domain
  //   port: 5173, // Optional, default is 5173
  // },
  // plugins: [react(), mkcert()],
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
