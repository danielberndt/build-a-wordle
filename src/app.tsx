import {useState} from "preact/hooks";
import logo from "./assets/logo-wide.svg";
import Board from "./Board";
import {Box, Col, Row} from "./Box";
import Frame from "./Frame";
import IntroOverlay from "./IntroOverlay";
import Keyboard from "./Keyboard";
import {BaseButton} from "./LetterButton";
import {AnnotadedLetter, AnnotatedKeys} from "./types";
import {themeBright} from "./ui.css";
import {useLocalStorageState} from "./useLocalStorage";
import deWords from "./word-lists/valid_words_de.json";

type HeadingProps = {onShowIntro: () => void};
const Heading = ({onShowIntro}: HeadingProps) => {
  return (
    <Row px={4} sp={3} pt={5} align="center">
      <Box as="a" href="/about/">
        <Box
          as="img"
          src={logo}
          alt="Wortle Logo"
          width="auto"
          height="2rem"
          forwardProps={{width: 730, height: 115}}
        />
      </Box>
      <BaseButton px={4} onClick={onShowIntro} ml="auto" style={{flex: "none"}}>
        Hilfe
      </BaseButton>
    </Row>
  );
};

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
  const [skpiIntro, setSkipIntro] = useLocalStorageState("skipIntro", false);

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
        <Heading onShowIntro={() => setSkipIntro(false)} />
        <Board guessWord={guessWord} input={input} submittedWords={submittedWords} />
        <Col minHeight="12rem">
          {gameState === "won" ? (
            <WonMessage onReplay={handleReplay} />
          ) : gameState === "lost" ? (
            <LostMessage guessWord={guessWord} onReplay={handleReplay} />
          ) : (
            <Keyboard
              setInput={setInput}
              input={input}
              onSubmitWord={handleSubmitWord}
              deWords={deWords}
              annotatedKeys={annotatedKeys}
            />
          )}
        </Col>
      </Frame>
      <IntroOverlay show={!skpiIntro} onClose={() => setSkipIntro(true)} />
    </Col>
  );
}
