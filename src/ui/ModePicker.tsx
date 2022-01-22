import {Box, Col, Row} from "./Box";
import {modePickerStyles as styles} from "./ModePicker.css";

const OptionLabel = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) => (
  <Box
    styleChild
    textTransform="uppercase"
    fontSize="xs"
    bold
    className={styles.optionLabel[active ? "active" : "inactive"]}
    userSelect="none"
    bg="transparent"
    borderWidth={0}
    textAlign="left"
  >
    <button onClick={onClick} tabIndex={-1}>
      {label}
    </button>
  </Box>
);

const ModePicker = ({onClick}: {onClick?: () => void}) => (
  <Row sp={2}>
    <Col
      styleChild
      bg="back"
      borderWidth={1}
      rounded="full"
      className={styles.track}
      align="start"
      overflow="hidden"
    >
      <button onClick={onClick}>
        <Box rounded="full" bg="front" className={styles.knob} elevations="sm" />
      </button>
    </Col>
    <Col sp={1}>
      <OptionLabel label="Training" active onClick={onClick} />
      <OptionLabel label="Challenge" onClick={onClick} />
    </Col>
  </Row>
);

export default ModePicker;
