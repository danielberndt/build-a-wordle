import {defineConfig} from "vite";
const {resolve} = require("path");
import preact from "@preact/preset-vite";
import {vanillaExtractPlugin} from "@vanilla-extract/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), vanillaExtractPlugin()],
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
});
