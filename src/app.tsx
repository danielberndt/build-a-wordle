import {StateUpdater, useEffect, useMemo, useRef, useState} from "preact/hooks";
import {Box, Col, Row} from "./Box";
import Frame from "./Frame";
import LetterButton, {BaseButton} from "./LetterButton";
import {AnnotadedLetter, AnnotatedKeys} from "./types";
import {pillThemes, themeBright} from "./ui.css";
import deWords from "./word-lists/valid_words_de.json";
import LetterBox, {LetterRow} from "./WordBox";

const Heading = () => <div>Heading</div>;

const MAX_GUESSES = 6;

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

const evaluateWord = ({word, guessWord}: {word: string; guessWord: string}): AnnotadedLetter[] => {
  const remainingLetters = Array.from(guessWord);
  const letters = Array.from(word);
  const correctIdx = new Set<number>();
  letters.forEach((l, idx) => {
    if (l === guessWord[idx]) {
      correctIdx.add(idx);
      remainingLetters.splice(remainingLetters.indexOf(l), 1);
    }
  });

  return letters.map((letter, idx) => {
    const getType = () => {
      if (correctIdx.has(idx)) return "correctPosition";
      if (remainingLetters.includes(letter)) {
        remainingLetters.splice(remainingLetters.indexOf(letter), 1);
        return "found";
      }
      return "notFound";
    };
    return {letter, type: getType()};
  });
};

const typeByColor: {[Type in AnnotadedLetter["type"]]: string} = {
  notFound: "gray",
  found: "orange",
  correctPosition: "green",
};

type SubmittedWordProps = {word: string; guessWord: string};
const SubmittedWord = ({word, guessWord}: SubmittedWordProps) => {
  const annotatedLetters = evaluateWord({word, guessWord});

  return (
    <LetterRow>
      {annotatedLetters.map(({letter, type}, idx) => (
        <LetterBox key={idx} letter={letter} type={type} />
      ))}
    </LetterRow>
  );
};

type BoardProps = {
  input: string;
  submittedWords: string[];
  guessWord: string;
};

const fillWith = (input: string, fillChar: string, len: number) => {
  if (input.length >= len) return Array.from(input);
  return [...input, ...Array.from(new Array(len - input.length), () => fillChar)];
};

const EmptyRow = () => (
  <LetterRow>
    <LetterBox />
    <LetterBox />
    <LetterBox />
    <LetterBox />
    <LetterBox />
  </LetterRow>
);

const Board = ({input, submittedWords, guessWord}: BoardProps) => (
  <Col sp={1} fillParent px={5} py={5} justify="center">
    {submittedWords.map((word, idx) => (
      <SubmittedWord key={idx} word={word} guessWord={guessWord} />
    ))}

    {submittedWords.length < MAX_GUESSES && (
      <LetterRow>
        {fillWith(input, "", 5).map((letter, idx) => (
          <LetterBox key={idx} letter={letter} />
        ))}
      </LetterRow>
    )}
    {Array.from(new Array(Math.max(0, MAX_GUESSES - submittedWords.length - 1))).map((_, idx) => (
      <EmptyRow key={idx} />
    ))}
  </Col>
);

const ErrorPill = ({error}: {error: string}) => (
  <Col absolute bottom="100%" left="0" right="0" align="center" py={4}>
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
    >
      {error}
    </Box>
  </Col>
);

const keyRows = ["qwertzuiop".split(""), "asdfghjkl".split(""), "yxcvbnm".split("")];

type ButtonInputProps = {
  input: string;
  setInput: StateUpdater<string>;
  onSubmitWord: (word: string) => void;
  deWords: string[];
  annotatedKeys: AnnotatedKeys;
};
const ButtonInput = ({input, setInput, onSubmitWord, deWords, annotatedKeys}: ButtonInputProps) => {
  const [error, setError] = useState<string | null>(null);
  const wordSet = useMemo(() => new Set(deWords), []);

  const handleSubmit = () => {
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
      console.log(e);
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
      {error && <ErrorPill error={error} />}
      <Row sp={2} fillParent>
        {keyRows[0].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={onAddLetter}
          />
        ))}
      </Row>
      <Row sp={2} px={4} fillParent>
        {keyRows[1].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={onAddLetter}
          />
        ))}
      </Row>
      <Row sp={2} fillParent>
        <BaseButton fontSize="sm" onClick={handleFormSubmit}>
          enter
        </BaseButton>
        {keyRows[2].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={onAddLetter}
          />
        ))}
        <BaseButton fontSize="sm" onClick={onBackspace}>
          del
        </BaseButton>
      </Row>
    </Col>
  );
};

const WonMessage = ({onReplay}: {onReplay: () => void}) => (
  <Col sp={4} align="center" justify="center" px={4} fillParent pb={4}>
    <Box bold fontSize="lg">
      Gewonnen 🎉
    </Box>
    <BaseButton onClick={onReplay} px={4}>
      Neuer Versuch
    </BaseButton>
  </Col>
);
const LostMessage = ({onReplay, guessWord}: {onReplay: () => void; guessWord: string}) => (
  <Col sp={2} align="center" px={4} fillParent pb={4}>
    <Box bold fontSize="lg">
      Verloren :(
    </Box>
    <Col align="center" justify="center" sp={1} fillParent>
      <Box>Das gesuchte Wort war</Box>
      <Box textTransform="uppercase" bold fontSize="xl">
        {guessWord}
      </Box>
    </Col>
    <BaseButton onClick={onReplay} px={4}>
      Neuer Versuch
    </BaseButton>
  </Col>
);

const getRandomElement = (list: string[]): string => {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
};

const getRandomWord = () => getRandomElement(deWords);

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

const getGameState = (opts: {submittedWords: string[]; guessWord: string}) => {
  const {submittedWords, guessWord} = opts;
  if (submittedWords[submittedWords.length - 1] === guessWord) return "won";
  if (submittedWords.length >= MAX_GUESSES) return "lost";
  return "playing";
};

export function App() {
  // const [guessWord, setGuessWord] = useState<string>("halte");
  // const [submittedWords, setSubmittedWords] = useState<string[]>([
  //   "bonus",
  //   "pferd",
  //   "autos",
  //   "magen",
  //   "bogen",
  //   "halte",
  // ]);

  const [guessWord, setGuessWord] = useState<string>(getRandomWord);
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);

  const [input, setInput] = useState<string>("");

  const gameState = getGameState({submittedWords, guessWord});
  const handleSubmitWord = (word: string) => {
    setSubmittedWords((prev) => [...prev, word]);
  };
  const guessWordMapping = createGuessWordMapping(guessWord);
  const annotatedKeys = getAnnotatedKeys({submittedWords, guessWordMapping});

  const handleReplay = () => {
    setGuessWord(getRandomWord());
    setInput("");
    setSubmittedWords([]);
  };

  return (
    <Col className={themeBright} fillParent>
      <Frame>
        {/* <Heading /> */}
        <Board guessWord={guessWord} input={input} submittedWords={submittedWords} />
        <Col minHeight="12rem">
          {gameState === "won" ? (
            <WonMessage onReplay={handleReplay} />
          ) : gameState === "lost" ? (
            <LostMessage guessWord={guessWord} onReplay={handleReplay} />
          ) : (
            <ButtonInput
              setInput={setInput}
              input={input}
              onSubmitWord={handleSubmitWord}
              deWords={deWords}
              annotatedKeys={annotatedKeys}
            />
          )}
        </Col>
      </Frame>
    </Col>
  );
}
