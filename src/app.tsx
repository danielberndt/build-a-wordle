import {useState} from "preact/hooks";
import logo from "./assets/logo-wide.svg";
import {Box, Col, Row} from "./ui/Box";
import Frame from "./Frame";
import IntroOverlay from "./IntroOverlay";
import {IconButton} from "./ui/Button";
import {useLocalStorageState} from "./useLocalStorage";
import {ReactComponent as HelpIcon} from "./assets/icons/question-mark.svg";
import ModePicker from "./ui/ModePicker";
import ChallengePreviewOverlay from "./ChallengePreviewOverlay";
import {Training} from "./Training";
import {animated, useTransition} from "react-spring";
import {springConfigs} from "./animation-utils";
import {ReactNode} from "react";
import {GameMode} from "./types";
import {useDevMode} from "./useDevMode";

type HeadingProps = {onShowIntro: () => void; picker: ReactNode};
const Heading = ({onShowIntro, picker}: HeadingProps) => {
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
      <Box ml="auto">{picker}</Box>
    </Row>
  );
};

const modeComp = {
  training: Training,
  challenge: Training,
};

const ShowMode = ({mode}: {mode: GameMode}) => {
  console.log({mode});
  const fn = useTransition(mode, {
    enter: {y: "0%", opacity: 1, scale: 1},
    ...(mode === "training" && {
      from: {y: "-40%", opacity: 0, scale: 0.25},
      leave: {y: "100%", opacity: 0, scale: 0.25},
    }),
    ...(mode === "challenge" && {
      from: {y: "100%", opacity: 0, scale: 0.25},
      leave: {y: "-40%", opacity: 0, scale: 0.25},
    }),
  });
  return (
    <Col relative fillParent>
      {fn((props, mode) => {
        const Comp = modeComp[mode];
        return (
          <Col styleChild absolute top="0" left="0" right="0" bottom="0">
            <animated.div style={props}>
              <Comp />
            </animated.div>
          </Col>
        );
      })}
    </Col>
  );
};

export function App() {
  const [skpiIntro, setSkipIntro] = useLocalStorageState("skipIntro", false);
  const [showChallengeMode, setShowChallengeMode] = useState(false);
  const [mode, setMode] = useState<GameMode>("training");
  const isDevMode = useDevMode();
  console.log({isDevMode});

  const handleClickMode = (target: GameMode | null) => {
    if (isDevMode) {
      setMode(target || (mode === "training" ? "challenge" : "training"));
    } else {
      setShowChallengeMode(true);
    }
  };

  return (
    <Col fillParent color="primary">
      <Frame>
        <Heading
          onShowIntro={() => setSkipIntro(false)}
          picker={<ModePicker value={mode} onClick={handleClickMode} />}
        />
        <ShowMode mode={mode} />
      </Frame>
      <IntroOverlay show={!skpiIntro} onClose={() => setSkipIntro(true)} />
      <ChallengePreviewOverlay
        show={showChallengeMode}
        onClose={() => setShowChallengeMode(false)}
      />
    </Col>
  );
}
