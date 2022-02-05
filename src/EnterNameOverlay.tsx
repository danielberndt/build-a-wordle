import {useState} from "react";
import {ErrorPill, RawKeyboard} from "./Keyboard";
import {Box, Col} from "./ui/Box";
import {useLocalStorageState} from "./useLocalStorage";
import LetterBox, {LetterRow} from "./WordBox";

const fillWith = (input: string, fillChar: string, len: number) => {
  if (input.length >= len) return Array.from(input);
  return [...input, ...Array.from(new Array(len - input.length), () => fillChar)];
};

export const EnterNameContent = ({onReady}: {onReady: () => void}) => {
  const [input, setInput] = useLocalStorageState("name", "");
  console.log({input});
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!input) {
      setError("Bitte ein Wort mit 5 Buchstaben eingeben!");
      return;
    }

    if (!input.match(/^[a-zA-Z]+$/)) {
      setError("Bitte nur Buchstaben!");
      return;
    }

    if (input.length !== 5) {
      setError("Ich brauche 5 Buchstaben!");
      return;
    }

    setError(null);
    // TODO: save word!
    onReady();
  };

  const handlerLetter = (l: string) => {
    setInput(input.length < 5 ? input + l : input);
    setError(null);
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
    setError(null);
  };

  return (
    <Col pa={6} sp={5}>
      <Col sp={2}>
        <Box bold fontSize="lg" textAlign="center">
          Dein Name
        </Box>
      </Col>
      <Col height="5rem">
        <LetterRow>
          {fillWith(input, "", 5).map((letter, idx) => (
            <LetterBox key={idx} letter={letter} />
          ))}
        </LetterRow>
      </Col>
      <Col px={3} pb={3} sp={2} fillParent relative minHeight="12rem">
        <ErrorPill error={error} />
        <RawKeyboard
          onAddLetter={handlerLetter}
          onEnter={handleSubmit}
          onBackspace={handleBackspace}
        />
      </Col>
    </Col>
  );
};
