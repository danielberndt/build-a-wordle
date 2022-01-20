import {Box, Col, Link, Row} from "../Box";
import "../global-styles.css";
import logo from "../assets/logo.svg";
import sampleWordImage from "../assets/sample-word.png";
import {themeBright} from "../ui.css";
import {BaseButton} from "../LetterButton";
import {ReactNode} from "react";

const Fact = ({title, children}: {title: ReactNode; children: ReactNode}) => (
  <Box as="li">
    <Col sp={1}>
      <Box as="h3" fontSize="md">
        {title}
      </Box>
      <Box fontSize="sm" as="p">
        {children}
      </Box>
    </Col>
  </Box>
);

const About = () => (
  <Col className={themeBright} fillParent>
    <Col px={4} py={7} align="center" bg="brand">
      <Box
        as="img"
        src={logo}
        alt="Wortle Logo"
        height="8rem"
        forwardProps={{width: 372, height: 257}}
      />
    </Col>
    <Col bg="front" fillParent align="center">
      <Col width="100%" maxWidth="40rem" px={4} py={7} sp={7}>
        <Box as="h1" bold fontSize="xl" textAlign="center">
          Wortle - Das deutsche Wordle
        </Box>
        <Col sp={5}>
          <Box as="p">
            <Link href="https://www.powerlanguage.co.uk/wordle/" target="_blank">
              Wordle
            </Link>{" "}
            ist ein Riesenerfolg auf der ganzen, weiten Welt. Aber Wortspiele machen in der eigenen
            Muttersprache dann doch meist am meisten Spaß.
          </Box>
          <Box as="p">
            Deswegen habe ich für euch hier an einer deutsche Worlde Alternative gearbeitet:
          </Box>
        </Col>
        <Col align="center" sp={6}>
          <BaseButton as="a" href="/" px={4}>
            Zum Spiel
          </BaseButton>
          <Box as="a" href="/">
            <Box
              as="img"
              src={sampleWordImage}
              alt="Beispiel Spiel"
              // height="8rem"
              forwardProps={{width: 434, height: 364}}
            />
          </Box>
        </Col>
        <Col sp={5}>
          <Box as="h2" fontSize="lg">
            Hier ein paar Fakten zur deutschen Wordle Variante
          </Box>
          <Col as="ul" pl={4} sp={3}>
            <Fact title="Handverlesenes Lexikon">
              Über 1700 kuratierte Worte für die richtige Mischung aus bekannten und kniffeligen
              Wörtern.
            </Fact>
            <Fact title="Open Source">
              Entstanden aus dem Spaß an der Sache. Für die Neugierigen:{" "}
              <Link href="https://github.com/danielberndt/build-a-wordle">
                Hier geht's zum Code.
              </Link>
            </Fact>
            <Fact title="Flink und Schlank">
              Hier geht es einfach nur um den Spaß am Spiel. Keine Werbung, keine
              Micro-Transactions, keine Wartezeit.
            </Fact>
          </Col>
        </Col>
      </Col>
    </Col>
  </Col>
);

export default About;
