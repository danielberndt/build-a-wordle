import {ComponentChildren} from "preact";
import {useState} from "preact/hooks";
import {useEffect} from "react";
import {animated, useSpring} from "react-spring";
import {springConfigs} from "./animation-utils";
import {Col, Row} from "./Box";
import {AnnotadedLetter} from "./types";
import {wordBoxThemes} from "./ui.css";

type LetterBoxProps = {
  letter?: string;
  type?: AnnotadedLetter["type"] | "none" | "empty";
};

const annotationProps: {
  [Type in NonNullable<LetterBoxProps["type"]>]: keyof typeof wordBoxThemes;
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

const LetterBox = ({letter, type = letter ? "none" : "empty"}: LetterBoxProps) => {
  const [lastType, setLastType] = useState(type);
  useEffect(() => {
    setLastType(type);
  }, [type]);

  const props = useSpring({
    from: type === "none" ? {opacity: 0, scale: 1.5} : {opacity: 1, scale: 1},
    to: {opacity: 1, scale: 1},
    config: springConfigs.quick,
    reset: lastType !== type,
  });

  return (
    <Col
      as={animated.div as any}
      style={props}
      className={wordBoxThemes[annotationProps[type]]}
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
};

export default LetterBox;
