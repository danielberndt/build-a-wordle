import cx from "../cx";
import {GameMode} from "../types";
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

const ModePicker = ({
  onClick,
  value,
}: {
  onClick: (mode: GameMode | null) => void;
  value: GameMode;
}) => (
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
      <button onClick={() => onClick(null)}>
        <Box
          rounded="full"
          bg="front"
          className={cx(styles.knob, value === "challenge" && styles.knobBottom)}
          elevations="sm"
          relative
        />
      </button>
    </Col>
    <Col sp={1}>
      <OptionLabel
        label="Training"
        active={value === "training"}
        onClick={() => onClick("training")}
      />
      <OptionLabel
        label="Challenge"
        active={value === "challenge"}
        onClick={() => onClick("challenge")}
      />
    </Col>
  </Row>
);

export default ModePicker;
