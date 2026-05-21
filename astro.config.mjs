import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://viniciustaglieri.github.io",
  base: "/EpubReader",
  integrations: [react(), tailwind()],
  output: "static",
});
