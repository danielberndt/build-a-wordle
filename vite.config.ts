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
        start_url: ".",
        orientation: "portrait",
        display: "standalone",
        background_color: "#fff",
        lang: "de",
        icons: [
          {
            src: "icon.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
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
    cssCodeSplit: false,
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
