import {style} from "@vanilla-extract/css";
import {themeVars} from "./ui/app-theme.css";
import {media, radiusScale} from "./ui/ui.css";

export const frameStyle = style({
  "@media": {
    [media.nonMobile]: {
      borderRadius: radiusScale.lg,
      maxWidth: "28rem",
      maxHeight: "50rem",
      border: `2px solid ${themeVars.border}`,
      margin: "1rem",
    },
  },
});
