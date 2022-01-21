import {style} from "@vanilla-extract/css";
import {colors} from "./colors";
import {themeVars} from "./ui.css";

export const buttonThemes = {
  green: style({
    vars: {
      [themeVars.subThemeBg]: colors.green600,
      [themeVars.subThemeBgHover]: colors.green500,
      [themeVars.subThemeBorder]: colors.green400,
      [themeVars.subThemeText]: colors.green100,
    },
  }),
  yellow: style({
    vars: {
      [themeVars.subThemeBg]: colors.amber400,
      [themeVars.subThemeBgHover]: colors.amber300,
      [themeVars.subThemeBorder]: colors.amber500,
      [themeVars.subThemeText]: colors.amber800,
    },
  }),
  inactive: style({
    vars: {
      [themeVars.subThemeBg]: colors.gray600,
      [themeVars.subThemeBgHover]: colors.gray500,
      [themeVars.subThemeBorder]: colors.gray700,
      [themeVars.subThemeText]: colors.gray300,
    },
  }),
  neutral: style({
    vars: {
      [themeVars.subThemeBg]: colors.gray200,
      [themeVars.subThemeBgHover]: colors.gray100,
      [themeVars.subThemeBorder]: colors.gray300,
      [themeVars.subThemeText]: colors.gray800,
    },
  }),
};
