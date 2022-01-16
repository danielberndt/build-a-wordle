import {Box, BoxProps} from "./Box";
import {AnnotadedLetter} from "./types";
import {buttonThemes} from "./ui.css";

const buttonColorsByType: {[Type in AnnotadedLetter["type"]]: string} = {
  correctPosition: "green",
  found: "yellow",
  notFound: "gray",
};

const buttonStyle = {
  flex: "auto",
  minHeight: "2.5rem",
  minWidth: "1rem",
  margin: "2px 0.5vw",
  fontFamily: "monospace",
};

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

export const BaseButton = ({
  annotation,
  ...props
}: BoxProps<"button"> & {annotation?: AnnotadedLetter["type"]}) => (
  <Box
    as="button"
    height="3rem"
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
    className={buttonThemes[annotationProps[annotation || "none"]]}
    {...props}
  />
);

const LetterButton = ({letter, annotatedKey, onClick}: LetterButtonProps) => (
  <BaseButton annotation={annotatedKey} width="1rem" onClick={() => onClick(letter)}>
    {letter}
  </BaseButton>
);

export default LetterButton;
