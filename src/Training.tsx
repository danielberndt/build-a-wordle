import {useState} from "preact/hooks";
import {ComponentType, ReactElement, ReactNode, useEffect} from "react";
import {GameArea} from "./GameArea";
import {Box, Col} from "./ui/Box";
import {BaseButton} from "./ui/Button";
import deWords from "./word-lists/valid_words_de.json";

const getRandomElement = (list: string[]): string => {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
};

const getRandomWord = () => getRandomElement(deWords);

const WonMessage = ({onReset}: {onReset: () => void}) => (
  <Col sp={4} align="center" justify="center" px={4} fillParent pb={4}>
    <Box bold fontSize="lg">
      Gewonnen 🎉
    </Box>
    <BaseButton onClick={onReset}>Neuer Versuch</BaseButton>
  </Col>
);
const LostMessage = ({onReset, guessWord}: {onReset: () => void; guessWord: string}) => (
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
    <BaseButton onClick={onReset}>Neuer Versuch</BaseButton>
  </Col>
);

export const Training = ({}) => {
  // const [guessWord, setGuessWord] = useState<string>("halte");
  const [guessWord, setGuessWord] = useState<string>(getRandomWord);
  const [messageInfo, setMessageInfo] = useState<{
    comp: ComponentType<{onReset: () => void; guessWord: string}>;
    onReset: () => void;
  } | null>(null);

  const handleWon = ({onReset}: {onReset: () => void}) => {
    setMessageInfo({comp: WonMessage, onReset});
  };
  const handleLost = ({onReset}: {onReset: () => void}) => {
    setMessageInfo({comp: LostMessage, onReset});
  };

  const handleReset = () => {
    if (messageInfo) messageInfo.onReset();
    setMessageInfo(null);
    setGuessWord(getRandomWord());
  };

  return (
    <GameArea
      mode="training"
      guessWord={guessWord}
      messageArea={messageInfo && <messageInfo.comp onReset={handleReset} guessWord={guessWord} />}
      onWon={handleWon}
      onLost={handleLost}
    />
  );
};
