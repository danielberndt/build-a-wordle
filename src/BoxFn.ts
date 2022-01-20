import {ComponentType} from "preact";

export type Merge<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2 & {forwardProps?: P1};

export type BoxProps<OwnProps, As = "div"> = As extends keyof JSX.IntrinsicElements
  ? Merge<JSX.IntrinsicElements[As], OwnProps & {as?: As}>
  : As extends ComponentType<infer P>
  ? Merge<P, OwnProps & {as: As}>
  : never;

export type BoxFnWithJSXDefault<OwnProps, DefaultAs = "div"> = <As = DefaultAs>(
  props: BoxProps<OwnProps, As>
) => JSX.Element;

// const Box: BoxFnWithJSXDefault<{myCol?: "green"}> = (props: any) => {
//   const {as: Comp = "div", ...rest} = props;
//   return <Comp {...rest} />;
// };

// const MyButton = ({active}: {active: boolean; hi: number; className?: string}) => {
//   return <button>{active ? "hi" : "hi"}</button>;
// };
// const BadButton = ({active}: {active: boolean; hi: number}) => {
//   return <button>{active ? "hi" : "hi"}</button>;
// };

// const comps = [
//   Box({onClick: (e: any) => console.log(e)}),
//   Box({as: "button", onClick: (e) => console.log(e)}),
//   Box({as: "button", disabled: true, onClick: (e) => console.log(e), myCol: "green"}),
//   <Box as="button" myCol="green" onClick={(e) => console.log(e)} />,
//   <Box as="div" disabled />,
//   <Box as={MyButton} active hi={2} />,
//   <Box as={animated.div} style={{}} myCol="green" />,

//   <Box as="badButton" />,
//   <Box as="button" myCol="green" bad />,
//   <Box disabled onClick={(e) => console.log(e)} myCol="green" bad />,
//   <Box as={MyButton} active hi={2} bad />,
//   <Box as={BadButton} active hi={2} />,
// ];
