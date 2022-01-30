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
import {ReactNode} from "react";
import {GameMode} from "./types";
import {ActiveThemeProvider, useHeaderSlotStore} from "./HeaderSlot";
import {Challenge} from "./Challenge";
import {useDevMode} from "./useDevMode";

const DefaultHeaderSlot = ({onShowIntro}: any) => (
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
);

type HeadingProps = {onShowIntro: () => void; picker: ReactNode};
const Heading = ({onShowIntro, picker}: HeadingProps) => {
  const {mode, headerElement} = useHeaderSlotStore();

  const fn = useTransition(mode ? headerElement : <DefaultHeaderSlot onShowIntro={onShowIntro} />, {
    key: mode || "default",
    enter: {y: "0px", opacity: 1, scale: 1},
    from: {y: "-200px", opacity: 0, scale: 0.85},
    leave: {y: "-10px", opacity: 0, scale: 0.25},
  });

  return (
    <Row px={4} sp={3} pt={5} align="center">
      <Box fillParent relative height="100%">
        {fn((props, el) => (
          <Col styleChild absolute top="0" left="0" right="0" bottom="0">
            <animated.div style={props}>{el}</animated.div>
          </Col>
        ))}
      </Box>
      <Box ml="auto">{picker}</Box>
    </Row>
  );
};

const modeComp = {
  training: Training,
  challenge: Challenge,
};

const ShowMode = ({mode: outerMode}: {mode: GameMode}) => {
  const fn = useTransition(outerMode, {
    enter: {y: "0%", opacity: 1, scale: 1},
    ...(outerMode === "training" && {
      from: {y: "-40%", opacity: 0, scale: 0.25},
      leave: {y: "100%", opacity: 0, scale: 0.25},
    }),
    ...(outerMode === "challenge" && {
      from: {y: "100%", opacity: 0, scale: 0.25},
      leave: {y: "-40%", opacity: 0, scale: 0.25},
    }),
  });
  return (
    <Box relative fillParent>
      {fn((props, mode) => {
        const Comp = modeComp[mode];
        return (
          <ActiveThemeProvider activeTheme={mode === outerMode ? mode : null}>
            <Col styleChild absolute top="0" left="0" right="0" bottom="0">
              <animated.div style={props}>
                <Comp />
              </animated.div>
            </Col>
          </ActiveThemeProvider>
        );
      })}
    </Box>
  );
};

export function App() {
  const [skpiIntro, setSkipIntro] = useLocalStorageState("skipIntro", false);
  const [showChallengeMode, setShowChallengeMode] = useState(false);
  const [mode, setMode] = useState<GameMode>("training");
  const isDevMode = useDevMode();

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
