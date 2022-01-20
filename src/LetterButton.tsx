import {Box, BoxProps} from "./Box";
import {AnnotadedLetter} from "./types";
import {buttonThemes} from "./ui.css";

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
    display="flex"
    flexDir="row"
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
