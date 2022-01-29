import {useRef, useState} from "preact/hooks";
import logo from "./assets/logo-wide.svg";
import Board from "./Board";
import {Box, Col, Row} from "./ui/Box";
import Frame from "./Frame";
import IntroOverlay from "./IntroOverlay";
import Keyboard from "./Keyboard";
import {BaseButton, IconButton} from "./ui/Button";
import {useLocalStorageState} from "./useLocalStorage";
import deWords from "./word-lists/valid_words_de.json";
import {ReactComponent as HelpIcon} from "./assets/icons/question-mark.svg";
import ModePicker from "./ui/ModePicker";
import ChallengePreviewOverlay from "./ChallengePreviewOverlay";
import {ReactNode, useEffect} from "react";

type HeadingProps = {onShowIntro: () => void; onShowChallengePreview: () => void};
const Heading = ({onShowIntro, onShowChallengePreview}: HeadingProps) => {
  return (
    <Row px={4} sp={3} pt={5} align="center">
      <Row align="center" sp={3}>
        <a href="/about/">
          <Box styleChild height="auto" width="8rem">
            <img src={logo} alt="Wortle Logo" width={730} height={115} />
          </Box>
        </a>
        <IconButton onClick={onShowIntro}>
          <HelpIcon />
        </IconButton>
      </Row>
      <Box ml="auto">
        <ModePicker onClick={onShowChallengePreview} />
      </Box>
    </Row>
  );
};

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
  const [skpiIntro, setSkipIntro] = useLocalStorageState("skipIntro", false);
  const [showChallengeMode, setShowChallengeMode] = useState(false);
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
    <Col fillParent color="primary">
      <Frame>
        <Heading
          onShowIntro={() => setSkipIntro(false)}
          onShowChallengePreview={() => setShowChallengeMode(true)}
        />
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
      </Frame>
      <IntroOverlay show={!skpiIntro} onClose={() => setSkipIntro(true)} />
      <ChallengePreviewOverlay
        show={showChallengeMode}
        onClose={() => setShowChallengeMode(false)}
      />
    </Col>
  );
};
