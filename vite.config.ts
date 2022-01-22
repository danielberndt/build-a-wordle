import {defineConfig} from "vite";
import {resolve} from "path";
import preact from "@preact/preset-vite";
import {vanillaExtractPlugin} from "@vanilla-extract/vite-plugin";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), vanillaExtractPlugin(), svgr()],
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
