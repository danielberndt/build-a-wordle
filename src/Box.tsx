import {uiStyles} from "./ui.css";
import {forwardRef, cloneElement} from "preact/compat";
import type {UiStyles as RawStyleProps} from "./ui.css";
import type {ReactNode} from "react";

type Booleanify<E> = E extends "true" ? true : E;
export type StyleProps = {
  [Key in keyof RawStyleProps]?: Booleanify<keyof RawStyleProps[Key]> | false;
};

export type BoxProps = StyleProps & {className?: string; style?: JSX.CSSProperties} & (
    | {
        as?: keyof JSX.IntrinsicElements;
        children?: ReactNode;
        styleChild?: null;
      }
    | {
        as?: null;
        styleChild: true;
        children: ReactNode;
      }
  );

const applyProps = (props: Partial<BoxProps>, defaultComp: keyof JSX.IntrinsicElements) => {
  let Comp: any = defaultComp;
  const classList = [];
  for (const prop in props) {
    const val = props[prop as keyof BoxProps];
    if (val === null || val === undefined) continue;
    switch (prop) {
      case "as":
        Comp = val;
        break;
      case "children":
      case "styleChild":
      case "style":
        break;
      case "className":
        classList.push(val);
        break;
      default:
        const s = uiStyles[prop as keyof StyleProps];
        if (!s) {
          console.warn(`Can't apply style prop '${prop}' with value '${val as any}'`);
          continue;
        }
        if (val === false) continue;
        console.log({s, val, prop});
        classList.push((s as any)[val as any]);
    }
  }
  return {
    Comp,
    compProps: {
      className: classList.join(" "),
      children: props.children,
      styleChild: props.styleChild,
      style: props.style,
    },
  };
};

const createBox = (
  opts: StyleProps & Pick<BoxProps, "styleChild">,
  defaultComp: keyof JSX.IntrinsicElements = "div"
) => {
  return forwardRef((props: BoxProps, ref) => {
    const {Comp, compProps} = applyProps({...opts, ...props}, defaultComp);
    if (!props.styleChild) {
      return <Comp {...compProps} ref={ref} />;
    } else {
      return cloneElement(compProps.children as any, {
        className: compProps.className,
        style: compProps.style,
      });
    }
  });
};

export const Box = createBox({}, "div");
export const Row = createBox({display: "flex", flexDir: "row"}, "div");
export const Col = createBox({display: "flex", flexDir: "column"}, "div");

export const StyleLink = createBox({
  color: "link",
  hoverColor: "link",
  bold: true,
  styleChild: true,
});
