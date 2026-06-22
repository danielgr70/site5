import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import cloudflare from "@astrojs/cloudflare";
import keystatic from "@keystatic/astro";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: cloudflare(),
  redirects: {
    "/admin": "/keystatic",
    "/admin/[...path]": "/keystatic/[...path]",
  },
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    tailwind({ applyBaseStyles: false }),
  ], 
});
