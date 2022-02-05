import {Box, Col} from "./ui/Box";
import {BaseButton} from "./ui/Button";

export const ChallengePreviewContent = ({onClose}: {onClose: () => void}) => (
  <Col pa={6} sp={5}>
    <Col sp={2}>
      <Box bold fontSize="lg" textAlign="center">
        Gib mir noch Zeit.
        <br />
        Ein kleines bisschen nur. 🌼
      </Box>
    </Col>
    <Col sp={3}>
      <Box bold>Der Challenge Mode ist noch in Arbeit.</Box>
      <Box>
        Löse ein fixe Anzahl an Wörtern unterschiedlicher Schwierigkeit in möglichst schnell und mit
        möglichst wenig Versuchen, um a) deinen Platz an der Sonne und b) in der täglichen und
        wöchtenlichen High-Score Liste zu sichern!
      </Box>
      <Box>Nutze bis dahin den Trainings-Modus, um dich bestens vorzubereiten.</Box>
    </Col>

    <Col align="center">
      <BaseButton onClick={onClose}>Alles klar!</BaseButton>
    </Col>
  </Col>
);
