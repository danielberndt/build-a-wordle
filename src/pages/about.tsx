import {Box, Col, StyleLink, Row} from "../Box";
import "../global-styles.css";
import logo from "../assets/logo.svg";
import sampleWordImage from "../assets/sample-word.png";
import {themeBright} from "../ui.css";
import {ButtonStyle} from "../LetterButton";
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
      <Box styleChild height="8rem">
        <img width={372} height={257} src={logo} alt="Wortle Logo" />
      </Box>
    </Col>
    <Col bg="front" fillParent align="center">
      <Col width="100%" maxWidth="40rem" px={4} py={7} sp={7}>
        <Box as="h1" bold fontSize="xl" textAlign="center">
          Wortle - Das deutsche Wordle
        </Box>
        <Col sp={5}>
          <Box as="p">
            <StyleLink>
              <a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">
                Wordle
              </a>
            </StyleLink>{" "}
            ist ein Riesenerfolg auf der ganzen, weiten Welt. Aber eine gute deutsche Version fehlte
            bislang.
          </Box>
          <Box as="p">
            Deswegen habe ich für euch an einer deutsche Worlde Alternative gearbeitet:
          </Box>
        </Col>
        <Col align="center" sp={6}>
          <ButtonStyle px={4}>
            <a href="/">Zum Spiel</a>
          </ButtonStyle>
          <a href="/">
            <Box styleChild width="20rem" height="auto">
              <img width={434} height={364} src={sampleWordImage} alt="Beispiel Spiel" />
            </Box>
          </a>
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
              <StyleLink>
                <a href="https://github.com/danielberndt/build-a-wordle">Hier geht's zum Code.</a>
              </StyleLink>
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
