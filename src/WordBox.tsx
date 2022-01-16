import {ComponentChildren} from "preact";
import {Box, Col, Row} from "./Box";
import {AnnotadedLetter} from "./types";
import {buttonThemes, wordBoxThemes} from "./ui.css";

type LetterBoxProps = {
  letter?: string;
  type?: AnnotadedLetter["type"] | "none";
};

const annotationProps: {
  [Type in AnnotadedLetter["type"] | "none" | "empty"]: keyof typeof wordBoxThemes;
} = {
  correctPosition: "green",
  found: "yellow",
  notFound: "inactive",
  none: "neutral",
  empty: "empty",
};

export const LetterRow = ({children}: {children: ComponentChildren}) => (
  <Row sp={1} fillParent minHeight="2rem" maxHeight="5rem" height="100%">
    {children}
  </Row>
);

const LetterBox = ({letter, type}: LetterBoxProps) => (
  <Col
    className={wordBoxThemes[annotationProps[type || (letter ? "none" : "empty")]]}
    width="1rem"
    rounded="sm"
    align="center"
    justify="center"
    fillParent
    borderWidth={2}
    bg="wordBox"
    borderColor="wordBox"
    color="wordBox"
    bold
    textTransform="uppercase"
    fontSize="xl"
  >
    {letter}
  </Col>
);

export default LetterBox;
