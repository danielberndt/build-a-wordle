import {
  ComplexStyleRule,
  createTheme,
  createThemeContract,
  style,
  styleVariants,
} from "@vanilla-extract/css";

// inspired by tailwind
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

  green100: "#dcfce7",
  green200: "#bbf7d0",
  green300: "#86efac",
  green400: "#4ade80",
  green500: "#22c55e",
  green600: "#16a34a",
  green700: "#15803d",
  green800: "#166534",
  green900: "#14532d",

  amber100: "#fef3c7",
  amber200: "#fde68a",
  amber300: "#fcd34d",
  amber400: "#fbbf24",
  amber500: "#f59e0b",
  amber600: "#d97706",
  amber700: "#b45309",
  amber800: "#92400e",
  amber900: "#78350f",

  rose100: "#ffe4e6",
  rose200: "#fecdd3",
  rose300: "#fda4af",
  rose400: "#fb7185",
  rose500: "#f43f5e",
  rose600: "#e11d48",
  rose700: "#be123c",
  rose800: "#9f1239",
  rose900: "#881337",
};

export const [themeBright, themeVars] = createTheme({
  foregroundBg: colors.white,
  backgrounBg: colors.gray200,
  textPrimary: colors.gray700,
  border: colors.gray300,

  actions: {
    green: {
      bg: colors.green600,
      bgHover: colors.green500,
      border: colors.green200,
      text: colors.green100,
    },
    yellow: {
      bg: colors.amber600,
      bgHover: colors.amber500,
      border: colors.amber200,
      text: colors.amber100,
    },
    inactive: {
      bg: colors.gray600,
      bgHover: colors.gray500,
      border: colors.gray200,
      text: colors.gray100,
    },
    neutral: {
      bg: colors.gray600,
      bgHover: colors.gray500,
      border: colors.gray200,
      text: colors.gray100,
    },
  },
});

const buttonTheme = createThemeContract({
  bg: "",
  bgHover: "",
  border: "",
  text: "",
});

export const buttonThemes = {
  green: createTheme(buttonTheme, {
    bg: colors.green600,
    bgHover: colors.green500,
    border: colors.green400,
    text: colors.green100,
  }),
  yellow: createTheme(buttonTheme, {
    bg: colors.amber400,
    bgHover: colors.amber300,
    border: colors.amber500,
    text: colors.amber800,
  }),
  inactive: createTheme(buttonTheme, {
    bg: colors.gray600,
    bgHover: colors.gray500,
    border: colors.gray700,
    text: colors.gray300,
  }),
  neutral: createTheme(buttonTheme, {
    bg: colors.gray200,
    bgHover: colors.gray100,
    border: colors.gray300,
    text: colors.gray800,
  }),
};

export const wordBoxTheme = createThemeContract({
  bg: "",
  border: "",
  text: "",
});

export const wordBoxThemes = {
  green: createTheme(wordBoxTheme, {
    bg: colors.green600,
    border: colors.green400,
    text: colors.green100,
  }),
  yellow: createTheme(wordBoxTheme, {
    bg: colors.amber400,
    border: colors.amber500,
    text: colors.amber800,
  }),
  inactive: createTheme(wordBoxTheme, {
    bg: colors.gray500,
    border: colors.gray700,
    text: colors.gray200,
  }),
  neutral: createTheme(wordBoxTheme, {
    bg: colors.white,
    border: colors.gray400,
    text: colors.gray800,
  }),
  empty: createTheme(wordBoxTheme, {
    bg: colors.white,
    border: colors.gray200,
    text: colors.gray800,
  }),
};

const spacingSteps = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 10];
const fontSizes = {
  sm: 12,
  md: 16,
  xl: 30,
};

const sizes = {sm: "20rem", md: "30rem", lg: "45rem"};

export const radiusScale = {
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "1rem",
  full: "9999em",
};

const bgColors = {
  front: themeVars.foregroundBg,
  back: themeVars.backgrounBg,

  button: buttonTheme.bg,
  wordBox: wordBoxTheme.bg,
};

const hoverBgColors = {
  button: buttonTheme.bgHover,
};

const borderColors = {
  button: buttonTheme.border,
  wordBox: wordBoxTheme.border,
};

const textColors = {
  primary: themeVars.textPrimary,
  button: buttonTheme.text,
  wordBox: wordBoxTheme.text,
};

const withColorsTransition = style([
  {
    transitionProperty: "background-color, border-color, color, fill, stroke, box-shadow",
    transitionDuration: "0.15s",
  },
]);

const withBorder = style({borderStyle: "solid"});

type StyleArrayFn = <StyleMap extends Record<string | number, unknown>, T extends keyof StyleMap>(
  array: T[],
  mapFn: (val: T) => ComplexStyleRule
) => Record<T, string>;

const styleArray: StyleArrayFn = (arr, mapFn) => {
  const map = {} as any;
  arr.forEach((val) => (map[val] = style(mapFn(val))));
  return map;
};

export const media = {
  nonMobile: "screen and (min-width: 30em)",
  // sm: "screen and (max-width: 30em)",
  // md: "screen and (max-width: 45em)",
  // lg: "screen and (max-width: 60em)",
  // xl: "screen and (max-width: 80em)",
};

const baseStyles = {
  pt: spacingSteps.map((v) => style({paddingTop: `${v}rem`})),
  pl: spacingSteps.map((v) => style({paddingLeft: `${v}rem`})),
  pr: spacingSteps.map((v) => style({paddingRight: `${v}rem`})),
  pb: spacingSteps.map((v) => style({paddingBottom: `${v}rem`})),

  sp: spacingSteps.map((v) => style({gap: `${v}rem`})),

  display: styleVariants(
    {block: "block", flex: "flex", inlineBlock: "inline-block", grid: "grid", none: "none"},
    (val) => ({display: val})
  ),
  flexDir: styleArray(["column", "row"], (val) => ({flexDirection: val})),
  align: styleVariants(
    {
      end: "flex-end",
      start: "flex-start",
      stretch: "stretch",
      center: "center",
      baseline: "baseline",
    },
    (val) => ({alignItems: val})
  ),
  justify: styleVariants(
    {end: "flex-end", start: "flex-start", stretch: "stretch", center: "center"},
    (val) => ({justifyContent: val})
  ),
  color: styleVariants(textColors, (val) => [withColorsTransition, {color: val}]),
  bg: styleVariants(bgColors, (val) => [withColorsTransition, {backgroundColor: val}]),
  hoverBg: styleVariants(hoverBgColors, (val) => [
    withColorsTransition,
    {":hover": {backgroundColor: val}},
  ]),
  rounded: styleVariants(radiusScale, (val) => ({borderRadius: val})),
  position: styleArray(["absolute", "relative", "sticky", "fixed"], (val) => ({position: val})),
  fontSize: styleVariants(fontSizes, (val) => ({fontSize: `${val / 16}rem`})),

  borderWidth: styleArray([0, 1, 2], (val) =>
    val ? [withBorder, {borderWidth: val}] : {borderWidth: val}
  ),
  borderColor: styleVariants(borderColors, (val) => ({borderColor: val})),

  width: styleArray(["1rem", "100%"], (val) => ({width: val})),
  maxWidth: styleArray(["100%"], (val) => ({maxWidth: val})),
  height: styleArray(["3rem", "100%"], (val) => ({height: val})),
  maxHeight: styleArray(["5rem", "100%"], (val) => ({maxHeight: val})),
  minHeight: styleArray(["2rem"], (val) => ({minHeight: val})),

  textTransform: styleArray(["uppercase"], (val) => ({textTransform: val})),
  weight: styleArray(["normal", "bold"], (val) => ({fontWeight: val})),
};

export const uiStyles = {
  ...baseStyles,
  px: spacingSteps.map((_, idx) => style([baseStyles.pl[idx], baseStyles.pr[idx]])),
  py: spacingSteps.map((_, idx) => style([baseStyles.pt[idx], baseStyles.pb[idx]])),
  pa: spacingSteps.map((_, idx) =>
    style([baseStyles.pl[idx], baseStyles.pr[idx], baseStyles.pt[idx], baseStyles.pb[idx]])
  ),
  bold: {true: baseStyles.weight.bold},
  relative: {true: baseStyles.position.relative},
  absolute: {true: baseStyles.position.absolute},
  fillParent: {true: style({flex: "auto"})},
};

export type UiStyles = typeof uiStyles;
