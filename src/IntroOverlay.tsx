import {Box, Col} from "./ui/Box";
import {BaseButton} from "./ui/Button";
import Overlay from "./ui/Overlay";
import LetterBox, {LetterRow} from "./WordBox";

const Content = ({onClose}: {onClose: () => void}) => (
  <Col>
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
        <Box bold>Beispiel</Box>
        <LetterRow>
          <LetterBox letter="s" type="notFound" />
          <LetterBox letter="p" type="found" />
          <LetterBox letter="i" type="correctPosition" />
          <LetterBox letter="e" type="notFound" />
          <LetterBox letter="l" type="notFound" />
        </LetterRow>
        <Box as="p">
          <b>Graue Buchstaben:</b> Das gesuchte Wort enthält keinen dieser Buchstaben.
        </Box>
        <Box as="p">
          <b>Gelbe Buchstaben:</b> Das gesuchte Wort enthält diesen Buchstaben, aber an anderer
          Stelle.
        </Box>
        <Box as="p">
          <b>Grüne Buchstaben:</b> Das gesuchte Wort enthält diesen Buchstaben an genau dieser
          Stelle.
        </Box>
      </Col>

      <Col sp={2}>
        <Box bold>Ah, und es gelten Kreuzwortregeln</Box>
        <Box as="p">also Ä=AE, Ö=OE, Ü=UE, ß=SS</Box>
      </Col>

      <Col align="center">
        <BaseButton onClick={onClose}>Los geht's!</BaseButton>
      </Col>
    </Col>
    <Box fontSize="xs" color="secondary" px={6} pb={2}>
      Version: {((import.meta.env.VITE_APP_ID as string) || "DEV").slice(0, 24)}
    </Box>
  </Col>
);

const IntroOverlay = ({show, onClose}: {show: boolean; onClose: () => void}) => (
  <Overlay show={show} onClose={onClose} ContentComp={Content} />
);

export default IntroOverlay;
