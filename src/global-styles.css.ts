import {globalStyle} from "@vanilla-extract/css";

globalStyle("html, body", {
  height: "100%",
  width: "100%",
  padding: 0,
  margin: 0,
  background: "#fafafa",
  color: "#444",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',

  "@media": {
    "screen and (min-width: 30em)": {
      fontSize: "calc(0.925em + 0.25vw)",
    },
  },
});

globalStyle("*", {
  boxSizing: "border-box",
  padding: 0,
  margin: 0,
});

globalStyle("#app", {
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

globalStyle("img", {
  maxWidth: "100%",
});
globalStyle("input, button, textarea, select", {
  font: "inherit",
});
globalStyle("p, h1, h2, h3, h4, h5, h6", {
  overflowWrap: "break-word",
  hyphens: "auto",
});
