import {useState} from "preact/hooks";
import {Box, Col} from "./Box";
import Frame from "./Frame";
import Keyboard from "./Keyboard";
import {BaseButton} from "./LetterButton";
import {AnnotadedLetter, AnnotatedKeys} from "./types";
import {themeBright} from "./ui.css";
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

type SubmittedWordProps = {word: string; guessWord: string; isLast: boolean};
const SubmittedWord = ({word, guessWord, isLast}: SubmittedWordProps) => {
  const annotatedLetters = evaluateWord({word, guessWord});

  return (
    <LetterRow>
      {annotatedLetters.map(({letter, type}, idx) => (
        <LetterBox key={idx} letter={letter} type={type} animateReveal={isLast} idx={idx} />
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
      <SubmittedWord
        key={idx}
        word={word}
        guessWord={guessWord}
        isLast={idx === submittedWords.length - 1}
      />
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
    </Col>
  );
}
