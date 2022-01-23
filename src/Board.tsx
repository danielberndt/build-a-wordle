import {Col} from "./ui/Box";
import {AnnotadedLetter} from "./types";
import LetterBox, {LetterRow} from "./WordBox";

const MAX_GUESSES = 6;

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
        <LetterBox
          key={idx}
          letter={letter}
          type={type}
          animateReveal={isLast}
          idx={idx}
          won={guessWord == word}
        />
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
  <Col sp={1} fillParent px={5} py={4} justify="center">
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

export default Board;
