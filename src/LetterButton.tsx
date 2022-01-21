import {JSX} from "preact";
import {ReactNode} from "react";
import {AnnotadedLetter} from "./types";
import {StyleProps} from "./ui/Box";
import {ButtonStyle, ButtonStyleProps} from "./ui/Button";

type LetterButtonProps = {
  letter: string;
  annotatedKey: AnnotadedLetter["type"] | "none";
} & JSX.IntrinsicElements["button"];

const annotationProps: {[Type in AnnotadedLetter["type"] | "none"]: ButtonStyleProps["theme"]} = {
  correctPosition: "green",
  found: "yellow",
  notFound: "inactive",
  none: "neutral",
};

const LetterButtonStyle = ({
  annotatedKey,
  ...props
}: {annotatedKey: AnnotadedLetter["type"] | "none"; children: ReactNode} & StyleProps) => (
  <ButtonStyle
    theme={annotationProps[annotatedKey]}
    minHeight="2rem"
    maxHeight="5rem"
    height="100%"
    fillParent
    px={0}
    py={1}
    {...props}
  />
);

const LetterButton = ({letter, annotatedKey, ...rest}: LetterButtonProps) => (
  <LetterButtonStyle width="1rem" annotatedKey={annotatedKey}>
    <button {...rest}>{letter}</button>
  </LetterButtonStyle>
);

type NonLetterProps = {
  annotatedKey?: AnnotadedLetter["type"] | "none";
} & JSX.IntrinsicElements["button"];

export const NonLetterKeyboardButton = ({annotatedKey, ...rest}: NonLetterProps) => (
  <LetterButtonStyle annotatedKey={annotatedKey || "none"} fontSize="xs">
    <button {...rest} />
  </LetterButtonStyle>
);

export default LetterButton;
