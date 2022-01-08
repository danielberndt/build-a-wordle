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

const evaluateWord = ({
  word,
  guessWordMapping,
}: {
  word: string;
  guessWordMapping: GuessWordMapping;
}): AnnotadedLetter[] => {
  // const mapping = {
  //   g: [0],
  //   u: [1],
  //   e: [2]
  //   s: [3, 4]
  // }

  return Array.from(word).map((letter, idx) => {
    const indeces = guessWordMapping[letter];
    const getType = (): AnnotadedLetter["type"] => {
      if (indeces === undefined) return "notFound";
      if (indeces.includes(idx)) return "correctPosition";
      return "found";
    };
    return {letter, type: getType()};
  });
};

const typeByColor: {[Type in AnnotadedLetter["type"]]: string} = {
  notFound: "gray",
  found: "orange",
  correctPosition: "green",
};

type SubmittedWordProps = {word: string; guessWordMapping: GuessWordMapping};
const SubmittedWord = ({word, guessWordMapping}: SubmittedWordProps) => {
  const annotatedLetters = evaluateWord({word, guessWordMapping});

  return (
    <div>
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
  guessWordMapping: GuessWordMapping;
};

const Board = ({input, submittedWords, guessWordMapping}: BoardProps) => (
  <div>
    Board:
    {submittedWords.map((word, idx) => (
      <SubmittedWord key={idx} word={word} guessWordMapping={guessWordMapping} />
    ))}
    <div>{input}</div>
  </div>
);

type InputProps = {
  input: string;
  setInput: StateUpdater<string>;
  onSubmitWord: (word: string) => void;
  deWords: string[];
  annotatedKeys: AnnotatedKeys;
};

const Input = ({input, setInput, onSubmitWord, deWords}: InputProps) => {
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
    <div>
      {error && <div style={{color: "red"}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input type="text" value={input} onInput={(e: any) => setInput(e.target.value)} />
      </form>
    </div>
  );
};

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
const LetterButton = ({letter, annotatedKey, onClick}: LetterButtonProps) => {
  return (
    <button
      style={{backgroundColor: annotatedKey ? buttonColorsByType[annotatedKey] : undefined}}
      onClick={() => onClick(letter)}
    >
      {letter}
    </button>
  );
};

const NewInput = ({input, setInput, onSubmitWord, deWords, annotatedKeys}: InputProps) => {
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
    <div>
      {error && <div style={{color: "red"}}>{error}</div>}
      <div>
        {keyRows[0].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={(l) => setInput(input + l)}
          />
        ))}
      </div>
      <div>
        {keyRows[1].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={(l) => setInput(input + l)}
          />
        ))}
      </div>
      <div>
        <button onClick={handleSubmit}>enter</button>
        {keyRows[2].map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            annotatedKey={annotatedKeys[letter]}
            onClick={(l) => setInput(input + l)}
          />
        ))}
        <button onClick={() => setInput(input.slice(0, -1))}>del</button>
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
      <Board guessWordMapping={guessWordMapping} input={input} submittedWords={submittedWords} />
      <Input
        setInput={setInput}
        input={input}
        onSubmitWord={handleSubmitWord}
        deWords={deWords}
        annotatedKeys={annotatedKeys}
      />
      <NewInput
        setInput={setInput}
        input={input}
        onSubmitWord={handleSubmitWord}
        deWords={deWords}
        annotatedKeys={annotatedKeys}
      />
    </>
  );
}
