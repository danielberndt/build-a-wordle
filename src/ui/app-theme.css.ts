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

  transparentHover: "",
  iconButtonColor: "",
  iconButtonColorHover: "",

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
    error: {
      bg: "",
      bgHover: "",
      border: "",
      text: "",
    },
  },
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

  transparentHover: colors.gray700_a10,
  iconButtonColor: colors.gray500,
  iconButtonColorHover: colors.gray600,

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
    error: {
      bg: colors.rose600,
      bgHover: colors.rose500,
      border: colors.rose400,
      text: colors.rose100,
    },
  },
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

        transparentHover: colors.gray200_a20,
        iconButtonColor: "",
        iconButtonColorHover: colors.gray600,

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
          error: {
            bg: colors.rose800,
            bgHover: colors.rose600,
            border: colors.rose500,
            text: colors.rose200,
          },
        },
      }),
    },
  },
});
