import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "@unocss/astro";
import icon from "astro-icon";

import { remarkReadingTime } from "./src/lib/remark-reading-time.mjs";

import svelte from "@astrojs/svelte";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://shurgbee.dev/",
  integrations: [sitemap(), UnoCSS({ injectReset: true }), icon(), svelte()],
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  output: "server",
  adapter: cloudflare({ imageService: "compile" }),
  vite: {
    assetsInclude: "**/*.riv",
  },
});
