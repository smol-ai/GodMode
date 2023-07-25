import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  plugins: [
    svelte({
      configFile: "svelte.config.mjs",
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "settings.html"),
      },
    },
  },
});
