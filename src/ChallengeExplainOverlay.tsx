import {Box, Col} from "./ui/Box";
import {BaseButton} from "./ui/Button";

export const ChallengeExplainContent = ({onClose}: {onClose: () => void}) => (
  <Col pa={6} sp={5}>
    <Col sp={2}>
      <Box bold fontSize="lg" textAlign="center">
        Challenge-Regeln
      </Box>
    </Col>
    <Col as="ul" pl={4} sp={3}>
      <Box as="li">
        Der Countdown startet bei <b>5 Minuten</b>
      </Box>
      <Box as="li">
        Für jedes richtig geratene Wort gibt es <b>Punkte.</b>
      </Box>
      <Box as="li">
        Je <b>seltener die Buchstaben</b> im Wort desto <b>mehr Punkte.</b>
      </Box>
      <Box as="li">
        Je <b>weniger Versuche</b>, desto <b>mehr Zeit</b> wird gut geschrieben.
      </Box>
      <Box as="li">
        Ein falsches Wort kann nur <b>einmal</b> in einer Challenge eingegeben werden!
      </Box>
    </Col>

    <Col align="center">
      <BaseButton onClick={onClose}>Alles klar!</BaseButton>
    </Col>
  </Col>
);
