import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import cloudflare from "@astrojs/cloudflare";
import keystatic from "@keystatic/astro";

const assetBuildVersion =
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 10) ??
  process.env.ASSET_BUILD_VERSION ??
  String(Date.now());

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
  vite: {
    define: {
      __ASSET_BUILD_VERSION__: JSON.stringify(assetBuildVersion),
    },
  },
});
