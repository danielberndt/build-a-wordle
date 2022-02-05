import {Box, Col} from "./ui/Box";
import {BaseButton} from "./ui/Button";

export const ChallengeExplainContent = ({onClose}: {onClose: () => void}) => (
  <Col pa={6} sp={5}>
    <Col sp={2}>
      <Box bold fontSize="lg" textAlign="center">
        Challenge-Regeln
      </Box>
    </Col>
    <Col sp={3}>
      <Box bold>Hier werden die Regeln erklärt.</Box>
      <Box>...</Box>
    </Col>

    <Col align="center">
      <BaseButton onClick={onClose}>Alles klar!</BaseButton>
    </Col>
  </Col>
);
