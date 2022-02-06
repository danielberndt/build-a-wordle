import {useRef, useState} from "preact/hooks";
import {ReactNode, useEffect} from "react";
import {GameArea} from "./GameArea";
import {HeaderSlot} from "./HeaderSlot";
import {HighscoresContent, useHighscoreData} from "./Highscores";
import {getRandomElement, shuffleArray} from "./random";
import {Box, Col, Row} from "./ui/Box";
import {BaseButton} from "./ui/Button";
import {useOverlay} from "./ui/Overlay";
import deWords from "./word-lists/valid_words_de.json";
import {scoreWord} from "./word-utils";

const GameOver = ({onNext, guessWord}: {onNext: () => void; guessWord: string}) => (
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
    <BaseButton onClick={onNext}>Highscore Liste</BaseButton>
  </Col>
);

const LostMessage = ({onReset, guessWord}: {onReset: () => void; guessWord: string}) => (
  <Col sp={2} align="center" px={4} fillParent pb={4}>
    <Col align="center" justify="center" sp={1} fillParent>
      <Box>Das gesuchte Wort war</Box>
      <Box textTransform="uppercase" bold fontSize="xl">
        {guessWord}
      </Box>
    </Col>
    <BaseButton onClick={onReset}>Nächstes Wort</BaseButton>
  </Col>
);

const BASE_LENGHT_MS = 1000 * 5 * 60;

const pad2 = (n: number) => n.toString().padStart(2, "0");

const CountDown = ({endDate}: {endDate: Date}) => {
  const [currTime, setCurrTime] = useState(() => new Date());
  const diff = Math.max(0, Math.round((endDate.getTime() - currTime.getTime()) / 1000));

  useEffect(() => {
    let id: number;
    setCurrTime(new Date());
    const getNextTs = () => {
      const ms = (endDate.getTime() % 1000) + 1000;
      const currMs = new Date().getTime() % 1000;
      const nextTick = (ms - currMs) % 1000 || 1000;
      id = setTimeout(() => {
        const nextTime = new Date();
        setCurrTime(nextTime);
        if (nextTime < endDate) getNextTs();
      }, nextTick + 10);
    };
    getNextTs();
    return () => clearTimeout(id);
  }, [endDate]);

  const min = Math.floor(diff / 60);
  const trailSecs = diff - min * 60;

  return (
    <Box variantNumeric="tabularNums" bold fontSize="md">
      {min}:{pad2(trailSecs)}
    </Box>
  );
};

const Label = ({children}: {children: string}) => (
  <Box textTransform="uppercase" fontSize="xs" bold color="secondary">
    {children}
  </Box>
);

type Buckets = {
  simple: string[];
  medium: string[];
  hard: string[];
};

let _buckets: Buckets;
const getBuckets = (): Buckets => {
  if (!_buckets) {
    _buckets = {
      simple: [],
      medium: [],
      hard: [],
    };
    for (const word of deWords) {
      const score = scoreWord(word);
      if (score < 15) {
        _buckets.simple.push(word);
      } else if (score < 20) {
        _buckets.medium.push(word);
      } else {
        _buckets.hard.push(word);
      }
    }
  }
  return _buckets;
};

const createWordGenerator = () => {
  const buckets = getBuckets();
  const recentlyUsed: string[] = [];
  const getNextSet = (first: boolean): string[] => {
    const recentlyUsedSet = new Set(recentlyUsed);
    const pickWord = (list: string[]) => {
      while (true) {
        const picked = getRandomElement(list);
        if (!recentlyUsedSet.has(picked)) {
          recentlyUsed.push(picked);
          recentlyUsedSet.add(picked);
          return picked;
        }
      }
    };
    const list: string[] = first
      ? [pickWord(buckets.simple), pickWord(buckets.simple), pickWord(buckets.medium)]
      : [
          pickWord(buckets.simple),
          pickWord(buckets.simple),
          pickWord(buckets.medium),
          pickWord(buckets.medium),
          pickWord(buckets.hard),
        ];
    shuffleArray(list);
    if (recentlyUsed.length > 25) recentlyUsed.splice(0, 5);
    return first ? list.slice(0, 2) : list;
  };

  let currSet = getNextSet(true);

  return {
    getNext: () => {
      if (!currSet.length) currSet = getNextSet(false);
      return currSet.shift()!;
    },
  };
};

const useGuessWord = () => {
  const [wordGenerator, setWordGenerator] = useState(createWordGenerator);
  const [guessWord, setGuessWord] = useState<string>(() => wordGenerator.getNext());

  return {
    guessWord,
    getNextGuessWord: () => setGuessWord(wordGenerator.getNext()),
    resetWordGenerator: () => {
      const generator = createWordGenerator();
      setWordGenerator(generator);
      setGuessWord(generator.getNext());
    },
  };
};

export const Challenge = ({name}: {name: string | null}) => {
  const {guessWord, getNextGuessWord, resetWordGenerator} = useGuessWord();
  const [showLostWordComp, setShowLostWordComp] = useState<ReactNode>();
  const [gameKey, setGameKey] = useState(0);
  const [showHighscores, setShowHighscores] = useState(false);
  const [gameOverAt, setGameOverAt] = useState<Date>(
    () => new Date(new Date().getTime() + BASE_LENGHT_MS)
  );
  const [score, setScore] = useState(0);
  const [forbiddenWords, setForbiddenWords] = useState(() => new Set<string>());

  const [timeIsOut, setTimeIsOut] = useState(false);

  const {list, onSubmit, onGetList, onReset: onHighscoreReset} = useHighscoreData();

  const refs = useRef({name, score, onSubmit, onGetList});

  useEffect(() => {
    refs.current = {name, score, onSubmit, onGetList};
  });

  useEffect(() => {
    let id: number | null = null;
    const checkTimeOut = () => {
      id = requestAnimationFrame(() => {
        id = null;
        if (new Date() >= gameOverAt) {
          setTimeIsOut(true);
          if (refs.current.score && refs.current.name) {
            onSubmit({score: refs.current.score, name: refs.current.name});
          } else {
            onGetList();
          }
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

  const handleCloseHighscores = () => {
    handleReset();
    setShowHighscores(false);
    onHighscoreReset();
  };

  const handleHighscore = () => {
    setShowHighscores(true);
  };

  useOverlay(
    list &&
      showHighscores && {
        key: "highscores",
        overlayElement: (
          <HighscoresContent
            score={score}
            name={name}
            onClose={handleCloseHighscores}
            list={list}
          />
        ),
        onClose: handleCloseHighscores,
      }
  );

  const handleWon = ({
    onReset,
    submittedWords,
  }: {
    onReset: () => void;
    submittedWords: string[];
  }) => {
    onReset();
    getNextGuessWord();
    const freeSlots = 6 - submittedWords.length;
    if (freeSlots) {
      setGameOverAt(new Date(gameOverAt.getTime() + freeSlots * 20 * 1000));
    }
    // cap score at 35
    setScore(score + Math.min(35, scoreWord(guessWord)));
  };
  const handleLost = ({onReset}: {onReset: () => void}) => {
    setGameOverAt(new Date(gameOverAt.getTime() - 30 * 1000));
    setShowLostWordComp(
      <LostMessage
        guessWord={guessWord}
        onReset={() => {
          onReset();
          getNextGuessWord();
          setShowLostWordComp(null);
        }}
      />
    );
  };

  const handleReset = () => {
    setGameOverAt(() => new Date(new Date().getTime() + BASE_LENGHT_MS));
    resetWordGenerator();
    setGameKey((prev) => prev + 1);
    setTimeIsOut(false);
  };

  const handleWordSubmitted = (word: string) => {
    if (word === guessWord) return;
    setForbiddenWords((prev) => new Set([...prev, word]));
  };

  return (
    <>
      <GameArea
        mode="challenge"
        guessWord={guessWord}
        messageArea={
          timeIsOut ? <GameOver onNext={handleHighscore} guessWord={guessWord} /> : showLostWordComp
        }
        onWon={handleWon}
        onLost={handleLost}
        gameKey={gameKey}
        onWordSubmitted={handleWordSubmitted}
        forbiddenWords={forbiddenWords}
        showScores
      />
      <HeaderSlot>
        <Row sp={3}>
          <Col>
            <Label>Zeit</Label>
            <CountDown endDate={gameOverAt} />
          </Col>
          <Col>
            <Label>Punkte</Label>
            <Box variantNumeric="tabularNums" bold fontSize="md">
              {score}
            </Box>
          </Col>
        </Row>
      </HeaderSlot>
    </>
  );
};
