import {StateUpdater, useEffect, useMemo, useRef, useState} from "preact/hooks";
import {useTransition, animated} from "react-spring";
import {springConfigs} from "./animation-utils";
import {Box, Col, Row} from "./ui/Box";
import LetterButton, {NonLetterKeyboardButton} from "./LetterButton";
import {AnnotatedKeys} from "./types";
import {pillThemes} from "./ui/ui.css";

const ErrorPill = ({error}: {error: string | null}) => {
  const fn = useTransition(error, {
    from: {y: "3rem", opacity: 0, scale: 0.5},
    enter: {y: "0", opacity: 1, scale: 1},
    leave: {y: "-0.5rem", opacity: 0, scale: 1},
    config: springConfigs.quick,
  });
  return fn(
    (props, error) =>
      error && (
        <Col styleChild absolute bottom="100%" left="0" right="0" align="center" py={4} px={2}>
          <animated.div style={props}>
            <Box
              className={pillThemes.error}
              rounded="md"
              px={4}
              py={2}
              align="center"
              bg="pill"
              color="pill"
              borderWidth={2}
              bold
              borderColor="pill"
              textAlign="center"
            >
              {error}
            </Box>
          </animated.div>
        </Col>
      )
  );
};

const keyRows = ["qwertzuiop".split(""), "asdfghjkl".split(""), "yxcvbnm".split("")];

type KeyboardProps = {
  input: string;
  setInput: StateUpdater<string>;
  onSubmitWord: (word: string) => void;
  deWords: string[];
  annotatedKeys: AnnotatedKeys;
};
const Keyboard = ({input, setInput, onSubmitWord, deWords, annotatedKeys}: KeyboardProps) => {
  const [error, setError] = useState<string | null>(null);
  const wordSet = useMemo(() => new Set(deWords), []);

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

    if (!wordSet.has(input.toLowerCase())) {
      setError("Das Wort ist nicht in meiner Liste!");
      return;
    }

    setError(null);
    onSubmitWord(input.toLowerCase());
    setInput("");
  };

  const onAddLetter = (l: string) => {
    setInput((prev) => (prev.length < 5 ? prev + l : prev));
    setError(null);
  };

  const onBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
    setError(null);
  };

  const refs = useRef({handleSubmit, setInput, onAddLetter, onBackspace});
  useEffect(() => {
    refs.current = {
      handleSubmit,
      setInput,
      onAddLetter,
      onBackspace,
    };
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "enter") {
        refs.current.handleSubmit();
      }
      if (key.match(/^[a-z]$/)) refs.current.onAddLetter(key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Backspace") refs.current.onBackspace();
    };

    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Col px={3} pb={3} sp={2} fillParent relative>
      <ErrorPill error={error} />
      <Row sp={2} fillParent>
        {keyRows[0].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter] || "none"}
            onClick={() => onAddLetter(letter)}
          />
        ))}
      </Row>
      <Row sp={2} px={4} fillParent>
        {keyRows[1].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter] || "none"}
            onClick={() => onAddLetter(letter)}
          />
        ))}
      </Row>
      <Row sp={2} fillParent>
        <NonLetterKeyboardButton onClick={handleFormSubmit}>enter</NonLetterKeyboardButton>
        {keyRows[2].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter] || "none"}
            onClick={() => onAddLetter(letter)}
          />
        ))}
        <NonLetterKeyboardButton onClick={onBackspace}>del</NonLetterKeyboardButton>
      </Row>
    </Col>
  );
};

export default Keyboard;
