import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                options: resolve(__dirname, "options.html"),
                popup: resolve(__dirname, "popup.html"),

            }
        },
        outDir: "dist",
        emptyOutDir: true
    }
});