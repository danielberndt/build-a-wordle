import {style, styleVariants} from "@vanilla-extract/css";
import {themeVars} from "./ui/app-theme.css";

export const wordBoxStyles = {
  ...styleVariants(themeVars.actions, (val, key) => ({
    backgroundColor: themeVars.actions[key].bg,
    borderColor: themeVars.actions[key].border,
    color: themeVars.actions[key].text,
  })),
  empty: style({
    backgroundColor: themeVars.foregroundBg,
    borderColor: themeVars.border,
    color: themeVars.textPrimary,
  }),
};
