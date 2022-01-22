import {Box, Col} from "./ui/Box";
import {BaseButton} from "./ui/Button";
import Overlay from "./ui/Overlay";
import LetterBox, {LetterRow} from "./WordBox";

const Content = ({onClose}: {onClose: () => void}) => (
  <Col pa={6} sp={5}>
    <Col sp={2}>
      <Box bold fontSize="lg">
        Errate das Wort!
      </Box>
      <Box>
        Du hast <b>sechs Versuche</b>. Gib mir irgendein Wort mit <b>fünf Buchstaben</b> und ich
        sage dir, welche Buchstaben korrekt waren.
      </Box>
    </Col>
    <Col sp={3}>
      <Box bold>Beispiel:</Box>
      <LetterRow>
        <LetterBox letter="s" type="notFound" />
        <LetterBox letter="p" type="found" />
        <LetterBox letter="i" type="correctPosition" />
        <LetterBox letter="e" type="notFound" />
        <LetterBox letter="l" type="notFound" />
      </LetterRow>
      <Box>
        <b>Graue Buchstaben:</b> Das gesuchte Wort enthält keinen dieser Buchstaben.
      </Box>
      <Box>
        <b>Gelbe Buchstaben:</b> Das gesuchte Wort enthält diesen Buchstaben, aber an anderer
        Stelle.
      </Box>
      <Box>
        <b>Grüne Buchstaben:</b> Das gesuchte Wort enthält diesen Buchstaben an genau dieser Stelle.
      </Box>
    </Col>

    <Col align="center">
      <BaseButton onClick={onClose}>Los geht's!</BaseButton>
    </Col>
  </Col>
);

const IntroOverlay = ({show, onClose}: {show: boolean; onClose: () => void}) => (
  <Overlay show={show} onClose={onClose} ContentComp={Content} />
);

export default IntroOverlay;
