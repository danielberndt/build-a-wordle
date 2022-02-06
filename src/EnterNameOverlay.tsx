import {useState} from "react";
import {animated} from "react-spring";
import {ErrorPill, RawKeyboard} from "./Keyboard";
import {Box, Col} from "./ui/Box";
import {useOverlayAnimProps} from "./ui/Overlay";
import {useLocalStorageState} from "./useLocalStorage";
import LetterBox, {LetterRow} from "./WordBox";

const fillWith = (input: string, fillChar: string, len: number) => {
  if (input.length >= len) return Array.from(input);
  return [...input, ...Array.from(new Array(len - input.length), () => fillChar)];
};

export const EnterNameContent = ({onReady}: {onReady: () => void}) => {
  const [input, setInput] = useLocalStorageState("name", "");
  const [error, setError] = useState<string | null>(null);

  const animProps = useOverlayAnimProps();

  const handleSubmit = () => {
    if (!input) {
      setError("Bitte ein Wort mit 5 Buchstaben eingeben!");
      return;
    }

    if (!input.match(/^[a-zA-Z]+$/)) {
      setError("Bitte nur Buchstaben!");
      return;
    }

    if (input.length !== 5) {
      setError("Ich brauche 5 Buchstaben!");
      return;
    }

    setError(null);
    // TODO: save word!
    onReady();
  };

  const handlerLetter = (l: string) => {
    setInput(input.length < 5 ? input + l : input);
    setError(null);
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
    setError(null);
  };

  return (
    <Col sp={3} fillParent>
      <Col align="center" justify="center" px={4} pa={5} minHeight="0" minWidth="0" fillParent>
        <Col
          styleChild
          bg="front"
          rounded="md"
          relative
          width="100%"
          maxWidth="28rem"
          maxHeight="100%"
          overflow="hidden"
          py={6}
          px={4}
          sp={5}
        >
          <animated.div style={animProps}>
            <Col sp={2}>
              <Box bold fontSize="lg" textAlign="center">
                Dein Name
              </Box>
            </Col>
            <Col height="4rem">
              <LetterRow>
                {fillWith(input, "", 5).map((letter, idx) => (
                  <LetterBox key={idx} letter={letter} />
                ))}
              </LetterRow>
            </Col>
          </animated.div>
        </Col>
      </Col>
      <Col styleChild relative bg="front" align="center">
        <animated.div style={animProps}>
          <ErrorPill error={error} />
          <Col maxWidth="28rem" width="100%" fillParent sp={2} px={3} py={2} minHeight="12rem">
            <RawKeyboard
              onAddLetter={handlerLetter}
              onEnter={handleSubmit}
              onBackspace={handleBackspace}
            />
          </Col>
        </animated.div>
      </Col>
    </Col>
  );
};
