import {createVar, style, styleVariants} from "@vanilla-extract/css";
import {themeVars} from "./app-theme.css";
import {withTransformTransition} from "./ui.css";

export const pillStyles = styleVariants({error: themeVars.actions.error}, (val, key) => ({
  backgroundColor: themeVars.actions[key].bg,
  borderColor: themeVars.actions[key].border,
  color: themeVars.actions[key].text,
}));

const sizeVar = createVar();

export const modePickerStyles = {
  optionLabel: {
    active: style({
      color: themeVars.actions.green.bg,
    }),
    inactive: style({
      color: themeVars.actions.neutral.border,
    }),
  },
  track: style({
    vars: {
      [sizeVar]: "0.75rem",
    },
    borderColor: themeVars.actions.neutral.border,
  }),
  knob: style([
    withTransformTransition,
    {
      width: sizeVar,
      height: sizeVar,
      transform: `translate3d(0,0,0)`,
    },
  ]),
  knobBottom: style({
    transform: `translate3d(0,calc(1.8rem - ${sizeVar}),0)`,
  }),
};
