import {StateUpdater, useMemo, useState} from "preact/hooks";
import deWords from "./word-lists/valid_words_de.json";

const Heading = () => <div>Heading</div>;

type AnnotadedLetter = {letter: string; type: "notFound" | "found" | "correctPosition"};
type AnnotatedKeys = {[letter: string]: AnnotadedLetter["type"] | undefined};

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
  const guessWordMapping = createGuessWordMapping(guessWord);
  // const mapping = {
  //   g: [0],
  //   u: [1],
  //   e: [2]
  //   s: [3, 4]
  // }

  const remainingLetters = new Set(Array.from(guessWord));
  const letters = Array.from(word);
  const correctIdx = new Set<number>();
  letters.forEach((l, idx) => {
    if (l === guessWord[idx]) {
      correctIdx.add(idx);
    }
    remainingLetters.delete(l);
  });

  return letters.map((letter, idx) => {
    const getType = () => {
      if (correctIdx.has(idx)) return "correctPosition";
      if (remainingLetters.has(letter)) {
        remainingLetters.delete(letter);
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
    <div style={{fontFamily: "monospace", fontSize: "12vw"}}>
      {annotatedLetters.map(({letter, type}, idx) => (
        <span key={idx} style={{color: typeByColor[type]}}>
          {letter}
        </span>
      ))}
    </div>
  );
};

type BoardProps = {
  input: string;
  submittedWords: string[];
  guessWord: string;
};

const Board = ({input, submittedWords, guessWord}: BoardProps) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
    {submittedWords.map((word, idx) => (
      <SubmittedWord key={idx} word={word} guessWord={guessWord} />
    ))}
    {input ? (
      <div style={{fontFamily: "monospace", fontSize: "12vw"}}>{input}</div>
    ) : (
      <div style={{fontSize: "5vw", color: "lightgray"}}>start typing...</div>
    )}
  </div>
);

const keyRows = ["qwertzuiop".split(""), "asdfghjkl".split(""), "yxcvbnm".split("")];

const buttonColorsByType: {[Type in AnnotadedLetter["type"]]: string} = {
  correctPosition: "green",
  found: "yellow",
  notFound: "gray",
};

type LetterButtonProps = {
  letter: string;
  annotatedKey: AnnotadedLetter["type"] | undefined;
  onClick: (letter: string) => unknown;
};

const buttonStyle = {
  flex: "auto",
  minHeight: "2.5rem",
  minWidth: "1rem",
  margin: "2px 0.5vw",
  fontFamily: "monospace",
};

const LetterButton = ({letter, annotatedKey, onClick}: LetterButtonProps) => {
  return (
    <button
      style={{
        ...buttonStyle,
        backgroundColor: annotatedKey ? buttonColorsByType[annotatedKey] : undefined,
      }}
      onClick={() => onClick(letter)}
    >
      {letter}
    </button>
  );
};

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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!input.match(/[a-zA-Z]/)) {
      setError("only letters please!");
      return;
    }

    if (input.length !== 5) {
      setError("5 letters please!");
      return;
    }

    if (!wordSet.has(input.toLowerCase())) {
      setError("not a valid word!");
      return;
    }

    setError(null);
    onSubmitWord(input.toLowerCase());
    setInput("");
  };

  return (
    <div style={{display: "flex", flexDirection: "column"}}>
      {error && <div style={{color: "red", textAlign: "center"}}>{error}</div>}
      <div style={{display: "flex"}}>
        {keyRows[0].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={(l) => setInput(input + l)}
          />
        ))}
      </div>
      <div style={{display: "flex"}}>
        {keyRows[1].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={(l) => setInput(input + l)}
          />
        ))}
      </div>
      <div style={{display: "flex"}}>
        <button style={buttonStyle} onClick={handleSubmit}>
          enter
        </button>
        {keyRows[2].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={(l) => setInput(input + l)}
          />
        ))}
        <button style={buttonStyle} onClick={() => setInput(input.slice(0, -1))}>
          del
        </button>
      </div>
    </div>
  );
};

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

export function App() {
  const [guessWord, setGuessWord] = useState<string>(getRandomWord);
  const [input, setInput] = useState<string>("");
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);

  const handleSubmitWord = (word: string) => {
    setSubmittedWords((prev) => [...prev, word]);
  };
  const guessWordMapping = createGuessWordMapping(guessWord);
  const annotatedKeys = getAnnotatedKeys({submittedWords, guessWordMapping});

  return (
    <>
      {/* <Heading /> */}
      <Board guessWord={guessWord} input={input} submittedWords={submittedWords} />
      <div style={{flex: "auto", maxHeight: 500}} />
      <ButtonInput
        setInput={setInput}
        input={input}
        onSubmitWord={handleSubmitWord}
        deWords={deWords}
        annotatedKeys={annotatedKeys}
      />
    </>
  );
}
