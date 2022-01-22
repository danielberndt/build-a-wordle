import {styleVariants} from "@vanilla-extract/css";
import {themeVars} from "./app-theme.css";

export const pillStyles = styleVariants({error: themeVars.actions.error}, (val, key) => ({
  backgroundColor: themeVars.actions[key].bg,
  borderColor: themeVars.actions[key].border,
  color: themeVars.actions[key].text,
}));
