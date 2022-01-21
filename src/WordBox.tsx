import {ComponentChildren} from "preact";
import {useRef, useState} from "preact/hooks";
import {useEffect, useLayoutEffect} from "react";
import {animated, useSpring} from "react-spring";
import {springConfigs} from "./animation-utils";
import {Col, Row} from "./ui/Box";
import {AnnotadedLetter} from "./types";
import {wordBoxThemes} from "./ui/ui.css";

type LetterBoxProps = {
  letter?: string;
  type?: AnnotadedLetter["type"] | "none" | "empty";
  animateReveal?: boolean;
  idx?: number;
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

const LetterBox = ({
  letter,
  type = letter ? "none" : "empty",
  animateReveal,
  idx = 0,
}: LetterBoxProps) => {
  if (animateReveal) console.log("reveal", letter);
  const [themeClass, setThemeClass] = useState<NonNullable<LetterBoxProps["type"]>>("none");

  const lastTypeRef = useRef(type);

  const [styles, api] = useSpring(() => ({
    to: {opacity: 1, scale: 1, scaleX: 1, rotate: 0},
    config: springConfigs.quick,
  }));

  useLayoutEffect(() => {
    if (lastTypeRef.current !== type) {
      if (type === "none") {
        api.set({scale: 2, opacity: 0});
        api.start({scale: 1, opacity: 1});
      }
    }
    lastTypeRef.current = type;
  }, [type, animateReveal, api]);

  useLayoutEffect(() => {
    if (animateReveal) {
      api.start({
        to: async (next) => {
          await next({scale: 0, rotate: 180, delay: idx * 150, config: {restVelocity: 0.1}});
          setThemeClass(type);
          await next({scale: 1, rotate: 360});
        },
      });
    }
  }, [animateReveal, api, idx]);

  return (
    <Col
      styleChild
      className={wordBoxThemes[annotationProps[animateReveal ? themeClass : type]]}
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
      <animated.div style={styles}>{letter}</animated.div>
    </Col>
  );
};

export default LetterBox;
