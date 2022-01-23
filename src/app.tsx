import {useState} from "preact/hooks";
import logo from "./assets/logo-wide.svg";
import Board from "./Board";
import {Box, Col, Row} from "./ui/Box";
import Frame from "./Frame";
import IntroOverlay from "./IntroOverlay";
import Keyboard from "./Keyboard";
import {BaseButton, IconButton} from "./ui/Button";
import {AnnotadedLetter, AnnotatedKeys} from "./types";
import {useLocalStorageState} from "./useLocalStorage";
import deWords from "./word-lists/valid_words_de.json";
import {ReactComponent as HelpIcon} from "./assets/icons/question-mark.svg";
import ModePicker from "./ui/ModePicker";
import ChallengePreviewOverlay from "./ChallengePreviewOverlay";
import {useEffect} from "react";

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

const WonMessage = ({onReplay}: {onReplay: () => void}) => (
  <Col sp={4} align="center" justify="center" px={4} fillParent pb={4}>
    <Box bold fontSize="lg">
      Gewonnen 🎉
    </Box>
    <BaseButton onClick={onReplay}>Neuer Versuch</BaseButton>
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
    <BaseButton onClick={onReplay}>Neuer Versuch</BaseButton>
  </Col>
);

const getRandomElement = (list: string[]): string => {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
};

const getRandomWord = () => getRandomElement(deWords);

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
  const [isRevealing, setIsRevealing] = useState(false);
  const [skpiIntro, setSkipIntro] = useLocalStorageState("skipIntro", false);
  const [showChallengeMode, setShowChallengeMode] = useState(false);

  const [input, setInput] = useState<string>("");

  const gameState = getGameState({submittedWords, guessWord});
  const handleSubmitWord = (word: string) => {
    setSubmittedWords((prev) => [...prev, word]);
    setIsRevealing(true);
  };

  useEffect(() => {
    if (isRevealing) {
      let id = setTimeout(() => {
        setIsRevealing(false);
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [isRevealing]);

  const handleReplay = () => {
    setGuessWord(getRandomWord());
    setInput("");
    setSubmittedWords([]);
  };

  return (
    <Col fillParent color="primary">
      <Frame>
        <Heading
          onShowIntro={() => setSkipIntro(false)}
          onShowChallengePreview={() => setShowChallengeMode(true)}
        />
        <Board guessWord={guessWord} input={input} submittedWords={submittedWords} />
        <Col minHeight="12rem">
          {!isRevealing && gameState === "won" ? (
            <WonMessage onReplay={handleReplay} />
          ) : !isRevealing && gameState === "lost" ? (
            <LostMessage guessWord={guessWord} onReplay={handleReplay} />
          ) : (
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
}
