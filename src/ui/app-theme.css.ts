import {
  assignVars,
  createGlobalTheme,
  createThemeContract,
  globalStyle,
} from "@vanilla-extract/css";
import {colors} from "./colors";

export const themeVars = createThemeContract({
  foregroundBg: "",
  backgrounBg: "",
  textPrimary: "",
  border: "",
  backdropBg: "",
  brandBg: "",

  textLink: "",
  textLinkHover: "",

  actions: {
    green: {
      bg: "",
      bgHover: "",
      border: "",
      text: "",
    },
    yellow: {
      bg: "",
      bgHover: "",
      border: "",
      text: "",
    },
    inactive: {
      bg: "",
      bgHover: "",
      border: "",
      text: "",
    },
    neutral: {
      bg: "",
      bgHover: "",
      border: "",
      text: "",
    },
  },

  subThemeBg: "",
  subThemeBgHover: "",
  subThemeBorder: "",
  subThemeText: "",
});

createGlobalTheme(":root", themeVars, {
  foregroundBg: colors.white,
  backgrounBg: colors.gray200,
  textPrimary: colors.gray700,
  border: colors.gray300,
  backdropBg: colors.gray200_a90,
  brandBg: colors.amber400,

  textLink: colors.amber500,
  textLinkHover: colors.amber600,

  actions: {
    green: {
      bg: colors.green600,
      bgHover: colors.green500,
      border: colors.green400,
      text: colors.green100,
    },
    yellow: {
      bg: colors.amber400,
      bgHover: colors.amber300,
      border: colors.amber500,
      text: colors.amber800,
    },
    inactive: {
      bg: colors.gray600,
      bgHover: colors.gray500,
      border: colors.gray700,
      text: colors.gray300,
    },
    neutral: {
      bg: colors.gray200,
      bgHover: colors.gray100,
      border: colors.gray300,
      text: colors.gray800,
    },
  },

  subThemeBg: colors.amber600,
  subThemeBgHover: colors.amber600,
  subThemeBorder: colors.amber600,
  subThemeText: colors.amber600,
});

globalStyle(":root", {
  "@media": {
    "(prefers-color-scheme: dark)": {
      vars: assignVars(themeVars, {
        foregroundBg: colors.gray800,
        backgrounBg: colors.gray900,
        textPrimary: colors.gray100,
        border: colors.gray600,
        backdropBg: colors.gray700_a90,
        brandBg: colors.amber400,

        textLink: colors.amber500,
        textLinkHover: colors.amber400,

        actions: {
          green: {
            bg: colors.green600,
            bgHover: colors.green500,
            border: colors.green400,
            text: colors.green100,
          },
          yellow: {
            bg: colors.amber600,
            bgHover: colors.amber500,
            border: colors.amber400,
            text: colors.amber100,
          },
          inactive: {
            bg: colors.gray500,
            bgHover: colors.gray400,
            border: colors.gray600,
            text: colors.gray700,
          },
          neutral: {
            bg: colors.gray700,
            bgHover: colors.gray500,
            border: colors.gray600,
            text: colors.gray300,
          },
        },

        subThemeBg: colors.amber600,
        subThemeBgHover: colors.amber600,
        subThemeBorder: colors.amber600,
        subThemeText: colors.amber600,
      }),
    },
  },
});
