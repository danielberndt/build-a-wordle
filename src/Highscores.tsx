import {useState} from "preact/hooks";
import {Box, Col, Row} from "./ui/Box";
import {BaseButton} from "./ui/Button";

type List = {name: string; score: number}[] | null;

const ShowList = ({list}: {list: NonNullable<List>}) => (
  <Col sp={1}>
    {list.map(({name, score}, idx) => (
      <Row key={idx}>
        <Box>{name}</Box>
        <Box ml="auto" bold fontSize="lg">
          {score}
        </Box>
      </Row>
    ))}
  </Col>
);

export const useHighscoreData = () => {
  const [list, setList] = useState<List>(null);
  const onSubmit = ({score, name}: {score: number; name: string}) => {
    fetch(`${import.meta.env.VITE_API_HOST}/add-score`, {
      method: "post",
      body: JSON.stringify({
        name,
        score,
        appVersion: (import.meta.env.VITE_APP_ID as string) || "DEV",
      }),
      headers: {"Content-Type": "application/json"},
    })
      .then((r) => r.json())
      .then((r) => setList(r.scores));
  };
  const onGetList = () => {
    fetch(`${import.meta.env.VITE_API_HOST}/get-weekly-scores`)
      .then((r) => r.json())
      .then((r) => setList(r.scores));
  };
  const onReset = () => setList([]);
  return {list, onSubmit, onGetList, onReset};
};

export const HighscoresContent = ({
  onClose,
  score,
  name,
  list,
}: {
  onClose: () => void;
  score: number;
  name: string | null;
  list: List;
}) => {
  return (
    <Col pa={6} sp={5}>
      <Col sp={2}>
        <Box bold fontSize="lg">
          Highscores der Woche
        </Box>
      </Col>
      {!list ? (
        <Box>Lade...</Box>
      ) : list.length === 0 ? (
        <Box>Noch keine Ergebnisse diese Woche</Box>
      ) : (
        <ShowList list={list} />
      )}

      <Col align="center">
        <BaseButton onClick={onClose}>Weiter</BaseButton>
      </Col>
    </Col>
  );
};
