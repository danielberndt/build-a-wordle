import {ComponentType, JSX, Ref} from "preact";

type Merge<P1 = {}, P2 = {}> = Omit<P1, keyof P2> & P2;

type WithClassName<P> = P extends {className: string}
  ? Omit<P, "className"> & {className?: string}
  : P extends {className?: string}
  ? P
  : never;

type ExtractCompProps<T> = T extends ComponentType<infer P> ? WithClassName<P> : never;

export type BoxFnWithJSXDefault<
  OwnProps,
  DefaultAs extends keyof JSX.IntrinsicElements = "div"
> = (<
  Comp extends ComponentType<WithClassName<P>>,
  P,
  Intrinsic extends keyof JSX.IntrinsicElements
>(
  props:
    | ({as: Comp} & Merge<ExtractCompProps<Comp>, OwnProps>)
    | ({as: Intrinsic} & Merge<JSX.IntrinsicElements[Intrinsic], OwnProps>)
) => JSX.Element) &
  ((props: {as?: never} & Merge<JSX.IntrinsicElements[DefaultAs], OwnProps>) => JSX.Element);

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
//   <Box as="button" myCol="green" onClick={(e) => console.log(e)} />,
//   <Box disabled onClick={(e) => console.log(e)} myCol="green" />,
//   <Box as="div" disabled />,
//   <Box as={MyButton} active hi={2} />,

//   <Box as="badButton" />,
//   <Box as="button" myCol="green" bad />,
//   <Box disabled onClick={(e) => console.log(e)} myCol="green" bad />,
//   <Box as={MyButton} active hi={2} bad />,
//   <Box as={BadButton} active hi={2} />,
// ];
