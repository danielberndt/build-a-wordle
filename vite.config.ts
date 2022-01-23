import {defineConfig} from "vite";
import {resolve} from "path";
import preact from "@preact/preset-vite";
import {vanillaExtractPlugin} from "@vanilla-extract/vite-plugin";
import svgr from "vite-plugin-svgr";
import {VitePWA} from "vite-plugin-pwa";
import {colors} from "./src/ui/colors";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    vanillaExtractPlugin(),
    svgr(),
    VitePWA({
      includeAssets: ["favicon.svg", "robots.txt"],
      registerType: "autoUpdate",
      manifest: {
        name: "Wortle",
        short_name: "Wortle",
        description: "Wortle auf Deutsch",
        theme_color: colors.amber400,
        orientation: "landscape",
        lang: "de",
        icons: [
          {
            src: "favicon.svg",
            sizes: "192x192",
            type: "image/svg",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  build: {
    rollupOptions: {
      input: process.env.VITE_SSR
        ? undefined
        : {
            main: resolve(__dirname, "index.html"),
            about: resolve(__dirname, "about/index.html"),
          },
    },
  },
  ...{ssr: {noExternal: /./}},
});
