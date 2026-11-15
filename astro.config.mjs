// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://freefri.github.io",
  // GitHub Pages serves the project under the repository name.
  base: "/fegado-prototype",
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "gl",
    locales: ["gl", "es"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
