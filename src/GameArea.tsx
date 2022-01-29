import {useRef, useState} from "preact/hooks";
import Board from "./Board";
import {Col} from "./ui/Box";
import Keyboard from "./Keyboard";
import deWords from "./word-lists/valid_words_de.json";
import {ReactNode, useEffect} from "react";

const MAX_GUESSES = 6;

const getGameState = (opts: {submittedWords: string[]; guessWord: string}) => {
  const {submittedWords, guessWord} = opts;
  if (submittedWords[submittedWords.length - 1] === guessWord) return "won";
  if (submittedWords.length >= MAX_GUESSES) return "lost";
  return "playing";
};

type GameAreaProps = {
  guessWord: string;
  mode: "training" | "challenge";
  messageArea: ReactNode;
  onWon: (opts: {submittedWords: string[]; onReset: () => void}) => void;
  onLost: (opts: {submittedWords: string[]; onReset: () => void}) => void;
};

export const GameArea = (props: GameAreaProps) => {
  const {guessWord, onWon, onLost, messageArea} = props;
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);

  const resetState = () => {
    setSubmittedWords([]);
  };
  const refs = useRef({submittedWords, guessWord, resetState});
  useEffect(() => {
    refs.current = {submittedWords, guessWord, resetState};
  });

  const [input, setInput] = useState<string>("");

  const handleSubmitWord = (word: string) => {
    setSubmittedWords((prev) => [...prev, word]);
    setIsRevealing(true);
  };

  useEffect(() => {
    if (isRevealing) {
      let id = setTimeout(() => {
        setIsRevealing(false);
        const gameState = getGameState(refs.current);
        const info = {
          submittedWords: refs.current.submittedWords,
          onReset: refs.current.resetState,
        };
        if (gameState === "won") {
          onWon(info);
        } else if (gameState === "lost") {
          onLost(info);
        }
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [isRevealing]);

  return (
    <>
      <Board guessWord={guessWord} input={input} submittedWords={submittedWords} />
      <Col minHeight="12rem">
        {messageArea || (
          <Keyboard
            setInput={setInput}
            input={input}
            onSubmitWord={handleSubmitWord}
            deWords={deWords}
            submittedWords={isRevealing ? submittedWords.slice(0, -1) : submittedWords}
            guessWord={guessWord}
          />
        )}
      </Col>
    </>
  );
};
