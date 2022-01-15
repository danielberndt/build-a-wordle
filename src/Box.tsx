import {uiStyles} from "./ui.css";
import type {UiStyles} from "./ui.css";
import {BoxFnWithJSXDefault} from "./BoxFn";
import {forwardRef} from "preact/compat";

type Booleanify<E> = E extends "true" ? true : E;
type BoxProps = {[Key in keyof UiStyles]?: Booleanify<keyof UiStyles[Key]> | false};

const getBoxProps = (props: any) => {
  let Comp = "div";
  const forwardProps = {} as any;
  const classNames = [];
  for (const prop in props) {
    const val = (props as any)[prop];
    if (val === null || val === undefined) continue;
    switch (prop) {
      case "as":
        Comp = val;
        break;
      case "children":
        forwardProps[prop] = val;
        break;
      case "className":
        classNames.push(val);
        break;
      case "forwardProps":
        if (val.className) classNames.push(val.className);
        Object.assign(forwardProps, val);
        break;
      default:
        const s = (uiStyles as any)[prop];
        if (!s) {
          forwardProps[prop] = val;
        } else {
          if (val === false) continue;
          const className = s[val];
          if (!className) throw new Error(`Unknown style '${prop}=${val}'`);
          classNames.push(className);
        }
    }
  }
  return {Comp, boxProps: forwardProps, classNames};
};

const createBoxProps = (defaultProps: BoxProps) => {
  const defaultBoxProps = getBoxProps(defaultProps);
  return forwardRef((props, ref) => {
    const {Comp, boxProps, classNames} = getBoxProps(props);
    classNames.push(...defaultBoxProps.classNames);
    boxProps.className = classNames.join(" ");
    return <Comp {...boxProps} ref={ref} />;
  }) as BoxFnWithJSXDefault<BoxProps>;
};

export const Box = createBoxProps({});
export const Row = createBoxProps({display: "flex", flexDir: "row"});
export const Col = createBoxProps({display: "flex", flexDir: "column"});
