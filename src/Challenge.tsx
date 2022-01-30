import {useState} from "preact/hooks";
import {ComponentType, ReactElement, ReactNode, useEffect} from "react";
import {GameArea} from "./GameArea";
import {HeaderSlot} from "./HeaderSlot";
import {Box, Col, Row} from "./ui/Box";
import {BaseButton} from "./ui/Button";
import deWords from "./word-lists/valid_words_de.json";

const getRandomElement = (list: string[]): string => {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx];
};

const getRandomWord = () => getRandomElement(deWords);

const GameOver = ({onReset, guessWord}: {onReset: () => void; guessWord: string}) => (
  <Col sp={4} align="center" justify="center" px={4} fillParent pb={4}>
    <Box bold fontSize="lg">
      Game Over
    </Box>
    <Col align="center" justify="center" sp={1} fillParent>
      <Box>Das aktuelle Wort wäre</Box>
      <Box textTransform="uppercase" bold fontSize="lg">
        {guessWord}
      </Box>
    </Col>
    <BaseButton onClick={onReset}>Neuer Versuch</BaseButton>
  </Col>
);

const BASE_LENGHT_MS = 1000 * 120;

const CountDown = ({endDate}: {endDate: Date}) => {
  const [currTime, setCurrTime] = useState(() => new Date());
  const diff = Math.max(0, Math.round((endDate.getTime() - currTime.getTime()) / 1000));

  useEffect(() => {
    let id: number;
    const getNextTs = () => {
      const ms = (endDate.getTime() % 1000) + 1000;
      const currMs = new Date().getTime() % 1000;
      const nextTick = (ms - currMs) % 1000 || 1000;
      id = setTimeout(() => {
        const nextTime = new Date();
        setCurrTime(nextTime);
        if (nextTime < endDate) getNextTs();
      }, nextTick);
    };
    getNextTs();
    return () => clearTimeout(id);
  }, [endDate]);

  return <span>{diff}</span>;
};

const Label = ({children}: {children: string}) => (
  <Box textTransform="uppercase" fontSize="xs" bold>
    {children}
  </Box>
);

export const Challenge = ({}) => {
  // const [guessWord, setGuessWord] = useState<string>("halte");
  const [guessWord, setGuessWord] = useState<string>(getRandomWord);
  const [gameOverAt, setGameOverAt] = useState<Date>(
    () => new Date(new Date().getTime() + BASE_LENGHT_MS)
  );
  const [score, setScore] = useState(0);

  const [timeIsOut, setTimeIsOut] = useState(false);

  useEffect(() => {
    let id: number | null = null;
    const checkTimeOut = () => {
      id = requestAnimationFrame(() => {
        id = null;
        if (new Date() >= gameOverAt) {
          setTimeIsOut(true);
        } else {
          checkTimeOut();
        }
      });
    };
    checkTimeOut();
    return () => {
      if (id) cancelAnimationFrame(id);
    };
  }, [gameOverAt]);

  const handleWon = ({
    onReset,
    submittedWords,
  }: {
    onReset: () => void;
    submittedWords: string[];
  }) => {
    onReset();
    setGuessWord(getRandomWord);
    const freeSlots = 6 - submittedWords.length;
    if (freeSlots) {
      setGameOverAt(new Date(gameOverAt.getTime() + freeSlots * 20 * 1000));
    }
    setScore(score + 1);
  };
  const handleLost = ({onReset}: {onReset: () => void}) => {
    onReset();
    setGameOverAt(new Date(gameOverAt.getTime() - 30 * 1000));
    setGuessWord(getRandomWord);
  };

  const handleReset = () => {
    setGameOverAt(() => new Date(new Date().getTime() + BASE_LENGHT_MS));
    setGuessWord(getRandomWord);
  };

  return (
    <>
      <GameArea
        mode="challenge"
        guessWord={guessWord}
        messageArea={timeIsOut && <GameOver onReset={handleReset} guessWord={guessWord} />}
        onWon={handleWon}
        onLost={handleLost}
      />
      <HeaderSlot>
        <Row sp={2}>
          <Col>
            <Label>Zeit</Label>
            <CountDown endDate={gameOverAt} />
          </Col>
          <Col>
            <Label>Punkte</Label>
            <span>{score}</span>
          </Col>
        </Row>
      </HeaderSlot>
    </>
  );
};
