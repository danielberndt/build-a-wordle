import {animated, useTransition} from "react-spring";
import {springConfigs} from "./animation-utils";
import {Box, Col} from "./Box";
import {BaseButton} from "./LetterButton";
import LetterBox, {LetterRow} from "./WordBox";

const IntroOverlay = ({show, onClose}: {show: boolean; onClose: () => void}) => {
  const renderFn = useTransition(show, {
    from: {opacity: 0, scale: 0.85, y: "2rem"},
    enter: {opacity: 1, scale: 1, y: "0rem"},
    leave: {opacity: 0, scale: 0.5},
    config: springConfigs.quick,
  });

  return renderFn(
    (props, shown) =>
      shown && (
        <Col
          position="fixed"
          top="0"
          left="0"
          height="100%"
          width="100%"
          align="center"
          justify="center"
          px={4}
          pa={5}
          zIndex={3}
          overflow="hidden"
        >
          <Col
            as={animated.div}
            absolute
            bg="backdrop"
            top="0"
            left="0"
            right="0"
            bottom="0"
            style={{
              opacity: props.opacity,
              pointerEvents: props.opacity.to((val) => (val > 0.3 ? "auto" : "none")),
            }}
            onClick={onClose}
          />
          <Col
            as={animated.div}
            style={props}
            bg="front"
            rounded="md"
            pa={6}
            sp={5}
            relative
            width="100%"
            maxWidth="28rem"
          >
            <Col sp={2}>
              <Box bold fontSize="lg">
                Errate das Wort!
              </Box>
              <Box>
                Du hast <b>sechs Versuche</b>. Gib mir irgendein Wort mit <b>fünf Buchstaben</b> und
                ich sage dir, welche Buchstaben korrekt waren.
              </Box>
            </Col>
            <Col sp={3}>
              <Box bold>Beispiel:</Box>
              <LetterRow>
                <LetterBox letter="s" type="notFound" />
                <LetterBox letter="p" type="found" />
                <LetterBox letter="i" type="correctPosition" />
                <LetterBox letter="e" type="notFound" />
                <LetterBox letter="l" type="notFound" />
              </LetterRow>
              <Box>
                <b>Graue Buchstaben:</b> Das gesuchte Wort enthält keinen dieser Buchstaben.
              </Box>
              <Box>
                <b>Gelbe Buchstaben:</b> Das gesuchte Wort enthält diesen Buchstaben, aber an
                anderer Stelle.
              </Box>
              <Box>
                <b>Grüne Buchstaben:</b> Das gesuchte Wort enthält diesen Buchstaben an genau dieser
                Stelle.
              </Box>
            </Col>

            <Col align="center">
              <BaseButton px={4} onClick={onClose}>
                Los geht's!
              </BaseButton>
            </Col>
          </Col>
        </Col>
      )
  );
};

export default IntroOverlay;
