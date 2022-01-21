import {styleVariants} from "@vanilla-extract/css";
import {themeVars} from "./app-theme.css";

export const buttonThemes = styleVariants(themeVars.actions, (val, key) => ({
  vars: {
    [themeVars.subThemeBg]: themeVars.actions[key].bg,
    [themeVars.subThemeBgHover]: themeVars.actions[key].bgHover,
    [themeVars.subThemeBorder]: themeVars.actions[key].border,
    [themeVars.subThemeText]: themeVars.actions[key].text,
  },
}));
