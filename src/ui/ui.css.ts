import {ComplexStyleRule, style, styleVariants} from "@vanilla-extract/css";
import {themeVars} from "./app-theme.css";

const spacingSteps = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 10];
const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 24,
  xl: 30,
};

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
  backdrop: themeVars.backdropBg,
  brand: themeVars.brandBg,
  transparent: "transparent",
};

const hoverBgColors = {};

const borderColors = {};

const textColors = {
  primary: themeVars.textPrimary,
  link: themeVars.textLink,
};

const textHoverColors = {
  link: themeVars.textLinkHover,
};

export const withColorsTransition = style([
  {
    transitionProperty: "background-color, border-color, color, fill, stroke, box-shadow",
    transitionDuration: "0.15s",
  },
]);

const withBorder = style({borderStyle: "solid"});

type StyleArrayFn = <StyleMap extends Record<string | number, unknown>, T extends keyof StyleMap>(
  array: readonly T[],
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

const baseDims = ["0", "100%"] as const;

const baseStyles = {
  pt: spacingSteps.map((v) => style({paddingTop: `${v}rem`})),
  pl: spacingSteps.map((v) => style({paddingLeft: `${v}rem`})),
  pr: spacingSteps.map((v) => style({paddingRight: `${v}rem`})),
  pb: spacingSteps.map((v) => style({paddingBottom: `${v}rem`})),

  ml: styleArray(["auto"], (val) => ({marginLeft: val})),

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
  hoverColor: styleVariants(textHoverColors, (val) => ({":hover": {color: val}})),
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

  width: styleArray(["auto", "1em", "1rem", "20rem", "100%"], (val) => ({width: val})),
  maxWidth: styleArray(["100%", "28rem", "40rem"], (val) => ({maxWidth: val})),
  height: styleArray(["auto", "1em", "1rem", "2rem", "8rem", "100%"], (val) => ({height: val})),
  maxHeight: styleArray(["3rem", "5rem", "100%"], (val) => ({maxHeight: val})),
  minHeight: styleArray(["2rem", "12rem"], (val) => ({minHeight: val})),

  left: styleArray(baseDims, (val) => ({left: val})),
  right: styleArray(baseDims, (val) => ({right: val})),
  top: styleArray(baseDims, (val) => ({top: val})),
  bottom: styleArray(baseDims, (val) => ({bottom: val})),

  textTransform: styleArray(["uppercase"], (val) => ({textTransform: val})),
  weight: styleArray(["normal", "bold"], (val) => ({fontWeight: val})),
  textAlign: styleArray(["left", "right", "center"], (val) => ({textAlign: val})),

  overflow: styleArray(["hidden"], (val) => ({overflow: val})),
  userSelect: styleArray(["none"], (val) => ({userSelect: val})),

  zIndex: styleArray([3], (val) => ({zIndex: val})),
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
