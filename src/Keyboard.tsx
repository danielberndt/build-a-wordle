import {StateUpdater, useEffect, useMemo, useRef, useState} from "preact/hooks";
import {useTransition, animated} from "react-spring";
import {springConfigs} from "./animation-utils";
import {Col, Row} from "./ui/Box";
import LetterButton, {NonLetterKeyboardButton} from "./LetterButton";
import {AnnotadedLetter, AnnotatedKeys} from "./types";
import {Pill} from "./ui/Pill";
import {useSetDevMode} from "./useDevMode";

const getAnnotatedKeys = ({
  submittedWords,
  guessWordMapping,
}: {
  submittedWords: string[];
  guessWordMapping: GuessWordMapping;
}): AnnotatedKeys => {
  const keys: AnnotatedKeys = {};

  submittedWords.forEach((word) => {
    Array.from(word).forEach((letter, idx) => {
      const indeces = guessWordMapping[letter];
      const getType = (): AnnotadedLetter["type"] => {
        if (indeces === undefined) return "notFound";
        if (indeces.includes(idx)) return "correctPosition";
        return "found";
      };
      const type = getType();
      if (type === "notFound") keys[letter] = type;
      if (type === "correctPosition") keys[letter] = type;
      if (type === "found" && keys[letter] !== "correctPosition") keys[letter] = type;
    });
  });
  return keys;
};

type GuessWordMapping = {[letter: string]: number[]};

const createGuessWordMapping = (guessWord: string): GuessWordMapping => {
  const mapping: {[letter: string]: number[]} = {};
  Array.from(guessWord).forEach((letter, idx) => {
    const exist = mapping[letter];
    if (exist) {
      exist.push(idx);
    } else {
      mapping[letter] = [idx];
    }
  });
  return mapping;
};

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
            <Pill type="error">{error}</Pill>
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
  submittedWords: string[];
  guessWord: string;
};
const Keyboard = ({
  input,
  setInput,
  onSubmitWord,
  deWords,
  submittedWords,
  guessWord,
}: KeyboardProps) => {
  const setDevMode = useSetDevMode();
  const [error, setError] = useState<string | null>(null);
  const wordSet = useMemo(() => new Set(deWords), []);

  const guessWordMapping = createGuessWordMapping(guessWord);
  const annotatedKeys = getAnnotatedKeys({submittedWords, guessWordMapping});

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

    if (input === "dajbm") {
      setError("Dev mode aktiv!");
      setDevMode(true);
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
