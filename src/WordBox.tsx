import {ComponentChildren} from "preact";
import {useRef, useState} from "preact/hooks";
import {useLayoutEffect} from "react";
import {animated, useSpring} from "react-spring";
import {springConfigs} from "./animation-utils";
import {Col, Row} from "./ui/Box";
import {AnnotadedLetter} from "./types";
import {wordBoxStyles} from "./WordBox.css";

type LetterBoxProps = {
  letter?: string;
  type?: AnnotadedLetter["type"] | "none" | "empty";
  animateReveal?: boolean;
  idx?: number;
  won?: boolean;
};

const annotationProps: {
  [Type in NonNullable<LetterBoxProps["type"]>]: keyof typeof wordBoxStyles;
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
  won,
}: LetterBoxProps) => {
  const [themeClass, setThemeClass] = useState<NonNullable<LetterBoxProps["type"]>>("none");

  const lastInfoRef = useRef({type, won});

  const [styles, api] = useSpring(() => ({
    to: {opacity: 1, scale: 1, scaleX: 1, rotate: 0, y: "0rem"},
    config: springConfigs.quick,
  }));

  useLayoutEffect(() => {
    if (lastInfoRef.current.type !== type) {
      if (type === "none") {
        api.set({scale: 2, opacity: 0});
        api.start({scale: 1, opacity: 1});
      }
    }
    lastInfoRef.current = {type, won};
  }, [type, animateReveal, api, won]);

  useLayoutEffect(() => {
    if (animateReveal) {
      api.start({
        to: async (next) => {
          await next({scale: 0, rotate: 180, delay: idx * 150, config: {restVelocity: 0.1}});
          setThemeClass(type);
          await next({scale: 1, rotate: 360});
          if (lastInfoRef.current.won) {
            await next({
              y: "-2rem",
              delay: 3 * 150 - idx * 50,
              config: {restVelocity: 0.1},
            });
            await next({y: "0rem", config: {friction: 12}});
          }
        },
      });
    }
  }, [animateReveal, api, idx]);

  return (
    <Col
      styleChild
      className={wordBoxStyles[annotationProps[animateReveal ? themeClass : type]]}
      width="1rem"
      rounded="sm"
      align="center"
      justify="center"
      fillParent
      borderWidth={2}
      bold
      textTransform="uppercase"
      fontSize="xl"
    >
      <animated.div style={styles}>{letter}</animated.div>
    </Col>
  );
};

export default LetterBox;
