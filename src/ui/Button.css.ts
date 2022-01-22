import {style, styleVariants} from "@vanilla-extract/css";
import {themeVars} from "./app-theme.css";
import {withColorsTransition} from "./ui.css";

export const buttonStyles = styleVariants(themeVars.actions, (val, key) => [
  withColorsTransition,
  {
    backgroundColor: themeVars.actions[key].bg,
    borderColor: themeVars.actions[key].border,
    color: themeVars.actions[key].text,
    ":hover": {
      backgroundColor: themeVars.actions[key].bgHover,
    },
  },
]);

export const iconButtonStyle = style([
  withColorsTransition,
  {
    padding: 3,
    margin: -3,
    color: themeVars.iconButtonColor,
    ":hover": {
      backgroundColor: themeVars.transparentHover,
      color: themeVars.iconButtonColorHover,
    },
  },
]);
