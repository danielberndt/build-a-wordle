import {style, styleVariants} from "@vanilla-extract/css";
import {themeVars} from "./ui/app-theme.css";

export const wordBoxThemes = {
  ...styleVariants(themeVars.actions, (val, key) => ({
    vars: {
      [themeVars.subThemeBg]: themeVars.actions[key].bg,
      [themeVars.subThemeBorder]: themeVars.actions[key].border,
      [themeVars.subThemeText]: themeVars.actions[key].text,
    },
  })),
  empty: style({
    vars: {
      [themeVars.subThemeBg]: themeVars.foregroundBg,
      [themeVars.subThemeBorder]: themeVars.border,
      [themeVars.subThemeText]: themeVars.textPrimary,
    },
  }),
};
