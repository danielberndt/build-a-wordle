import {JSX} from "preact";
import {ReactNode} from "react";
import {Row, StyleProps} from "./ui/Box";
import {AnnotadedLetter} from "./types";
import {buttonThemes} from "./ui/ui.css";

type LetterButtonProps = {
  letter: string;
  annotatedKey: AnnotadedLetter["type"] | undefined;
  onClick: (letter: string) => unknown;
};

const annotationProps: {[Type in AnnotadedLetter["type"] | "none"]: keyof typeof buttonThemes} = {
  correctPosition: "green",
  found: "yellow",
  notFound: "inactive",
  none: "neutral",
};

export const ButtonStyle = (
  props: StyleProps & {children: ReactNode; className?: string; style?: JSX.CSSProperties}
) => (
  <Row
    styleChild
    align="center"
    justify="center"
    minHeight="2rem"
    maxHeight="3rem"
    height="100%"
    rounded="md"
    fillParent
    bg="button"
    hoverBg="button"
    borderWidth={2}
    borderColor="button"
    color="button"
    bold
    textTransform="uppercase"
    fontSize="md"
    userSelect="none"
    className={buttonThemes[annotationProps["none"]]}
    {...props}
  />
);

export const BaseButton = ({
  annotation,
  onClick,
  children,
  ...props
}: StyleProps & {annotation?: AnnotadedLetter["type"]; style?: JSX.CSSProperties} & Pick<
    JSX.IntrinsicElements["button"],
    "onClick" | "children"
  >) => (
  <ButtonStyle className={buttonThemes[annotationProps[annotation || "none"]]} {...props}>
    <button type="button" onClick={onClick}>
      {children}
    </button>
  </ButtonStyle>
);

const LetterButton = ({letter, annotatedKey, onClick}: LetterButtonProps) => (
  <BaseButton annotation={annotatedKey} width="1rem" onClick={() => onClick(letter)}>
    {letter}
  </BaseButton>
);

export default LetterButton;
