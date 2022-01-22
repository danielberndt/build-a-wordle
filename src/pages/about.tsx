import {Box, Col, Row, StyleLink} from "../ui/Box";
import "../ui/global-styles.css";
import logo from "../assets/logo.svg";
import saftladen from "../assets/saftladen.png";
import {ReactNode} from "react";
import {ButtonStyle} from "../ui/Button";
import LetterBox, {LetterRow} from "../WordBox";

const TwitterIcon = ({className}: {className?: string}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-3.594-1.555c-3.18 0-5.515 2.966-4.797 6.045A13.978 13.978 0 0 1 1.67 3.15a4.93 4.93 0 0 0 1.524 6.573 4.903 4.903 0 0 1-2.23-.616c-.053 2.28 1.582 4.415 3.95 4.89a4.935 4.935 0 0 1-2.224.084 4.928 4.928 0 0 0 4.6 3.42A9.9 9.9 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.212c9.142 0 14.307-7.72 13.995-14.646A10.025 10.025 0 0 0 24 4.556z" />
  </svg>
);

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
  <Col fillParent color="primary">
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
        <Col sp={6} align="center">
          <ButtonStyle px={4}>
            <a href="/">Zum Spiel</a>
          </ButtonStyle>
          <Col styleChild sp={1} maxWidth="20rem" width="100%" height="16rem">
            <a href="/">
              <LetterRow>
                <LetterBox letter="r" type="found" />
                <LetterBox letter="a" type="notFound" />
                <LetterBox letter="t" type="notFound" />
                <LetterBox letter="e" type="correctPosition" />
                <LetterBox letter="n" type="notFound" />
              </LetterRow>
              <LetterRow>
                <LetterBox letter="e" type="found" />
                <LetterBox letter="i" type="found" />
                <LetterBox letter="m" type="notFound" />
                <LetterBox letter="e" type="correctPosition" />
                <LetterBox letter="r" type="correctPosition" />
              </LetterRow>
              <LetterRow>
                <LetterBox letter="g" type="found" />
                <LetterBox letter="e" type="correctPosition" />
                <LetterBox letter="i" type="correctPosition" />
                <LetterBox letter="e" type="correctPosition" />
                <LetterBox letter="r" type="correctPosition" />
              </LetterRow>
              <LetterRow>
                <LetterBox letter="f" type="correctPosition" />
                <LetterBox letter="e" type="correctPosition" />
                <LetterBox letter="i" type="correctPosition" />
                <LetterBox letter="e" type="correctPosition" />
                <LetterBox letter="r" type="correctPosition" />
              </LetterRow>
            </a>
          </Col>
        </Col>
        <Col sp={5}>
          <Box as="h2" fontSize="lg">
            Hier ein paar Infos zur deutschen Wordle Variante
          </Box>
          <Col as="ul" pl={4} sp={3}>
            <Fact title="Handverlesenes Lexikon">
              Über 1700 kuratierte Worte für die richtige Mischung aus bekannten und kniffeligen
              Wörtern.
            </Fact>
            <Fact title="Open Source">
              Entstanden aus dem Spaß an der Sache. Für die Neugierigen:{" "}
              <StyleLink>
                <a href="https://github.com/danielberndt/build-a-wordle">Hier der Code.</a>
              </StyleLink>
            </Fact>
            <Fact title="Flink und Schlank">
              Hier geht es einfach nur um den Spaß am Spiel. Keine Werbung, keine
              Micro-Transactions, keine Wartezeit.
            </Fact>
          </Col>
        </Col>

        <Col as="footer" pt={5} align="center" sp={5}>
          <Box fontSize="sm" textAlign="center" as="p" color="secondary">
            Entstanden in liebevoller Heimarbeit von{" "}
            <StyleLink>
              <Row styleChild sp={1} align="baseline" display="inlineFlex">
                <a href="https://twitter.com/D40B">
                  <Box styleChild width="1em" height="1em" display="block" relative top="0.1rem">
                    <TwitterIcon />
                  </Box>
                  <span>D40B</span>
                </a>
              </Row>
            </StyleLink>
          </Box>
          <a href="http://saftladen.berlin/">
            <Box styleChild width="6rem" height="auto">
              <img src={saftladen} alt="Saftladen" width={150} height={150} />
            </Box>
          </a>
        </Col>
      </Col>
    </Col>
  </Col>
);

export default About;
