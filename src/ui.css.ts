import {createTheme, style, styleVariants} from "@vanilla-extract/css";

const colors = {
  white: "#ffffff",

  gray100: "#f4f4f5",
  gray200: "#e4e4e7",
  gray300: "#d4d4d8",
  gray400: "#a1a1aa",
  gray500: "#71717a",
  gray600: "#52525b",
  gray700: "#3f3f46",
  gray800: "#27272a",
  gray900: "#18181b",
};

export const [themeBright, themeVars] = createTheme({
  foregroundBg: colors.white,
  backgrounBg: colors.gray200,
  textPrimary: colors.gray700,
});

const spacingSteps = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 10];
const fontSizes = {
  xs: [18, 18],
  sm: [20, 20],
  md: [24, 22],
  lg: [28, 24],
  xl: [36, 26],
  xxl: [48, 30],
};

const sizes = {sm: "20rem", md: "30rem", lg: "45rem"};

const radiusScale = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  full: "9999em",
};

const bgColors = {
  front: themeVars.foregroundBg,
  back: themeVars.backgrounBg,
};

const textColors = {
  primary: themeVars.textPrimary,
};

const withColorsTransition = style([
  {
    transitionProperty: "background-color, border-color, color, fill, stroke, box-shadow",
    transitionDuration: "0.15s",
  },
]);

const media = {
  sm: "screen and (max-width: 30em)",
  md: "screen and (max-width: 45em)",
  lg: "screen and (max-width: 60em)",
  xl: "screen and (max-width: 80em)",
};

const baseStyles = {
  pt: spacingSteps.map((v) => style({paddingTop: `${v}rem`})),
  pl: spacingSteps.map((v) => style({paddingLeft: `${v}rem`})),
  pr: spacingSteps.map((v) => style({paddingRight: `${v}rem`})),
  pb: spacingSteps.map((v) => style({paddingBottom: `${v}rem`})),

  sp: spacingSteps.map((v) => style({gap: `${v}rem`})),

  display: styleVariants({
    block: {display: "block"},
    flex: {display: "flex"},
    inlineBlock: {display: "inline-block"},
    grid: {display: "grid"},
    none: {display: "none"},
  }),
  flexDir: styleVariants({
    column: {flexDirection: "column"},
    row: {flexDirection: "row"},
  }),
  align: {
    end: style({alignItems: "flex-end"}),
    start: style({alignItems: "flex-start"}),
    stretch: style({alignItems: "stretch"}),
    center: style({alignItems: "center"}),
    baseline: style({alignItems: "baseline"}),
  },
  justify: {
    end: style({justifyContent: "flex-end"}),
    start: style({justifyContent: "flex-start"}),
    stretch: style({justifyContent: "stretch"}),
    center: style({justifyContent: "center"}),
  },
  color: styleVariants(textColors, (val) => [withColorsTransition, {color: val}]),
  bg: styleVariants(bgColors, (val) => [withColorsTransition, {backgroundColor: val}]),
  rounded: styleVariants(radiusScale, (val) => ({borderRadius: val})),
  position: styleVariants(
    {absolute: "absolute", relative: "relative", sticky: "sticky", fixed: "fixed"} as const,
    (val) => ({
      position: val,
    })
  ),
};

export const uiStyles = {
  ...baseStyles,
  px: spacingSteps.map((_, idx) => style([baseStyles.pl[idx], baseStyles.pr[idx]])),
  py: spacingSteps.map((_, idx) => style([baseStyles.pt[idx], baseStyles.pb[idx]])),
  pa: spacingSteps.map((_, idx) =>
    style([baseStyles.pl[idx], baseStyles.pr[idx], baseStyles.pt[idx], baseStyles.pb[idx]])
  ),
  // bold: {true: baseStyles.weight.bold},
  relative: {true: baseStyles.position.relative},
  absolute: {true: baseStyles.position.absolute},
  fillParent: {true: style({flex: "auto"})},
};

export type UiStyles = typeof uiStyles;
