import {ComponentType} from "react";
import {animated, useTransition} from "react-spring";
import {springConfigs} from "../animation-utils";
import {Box, Col} from "./Box";

type OverlayProps = {
  show: boolean;
  ContentComp: ComponentType<{onClose: () => void}>;
  onClose: () => void;
};

const Overlay = ({ContentComp, show, onClose}: OverlayProps) => {
  const renderFn = useTransition(show, {
    from: {opacity: 0, scale: 0.85, y: "2rem"},
    enter: {opacity: 1, scale: 1, y: "0rem"},
    leave: {opacity: 0, scale: 0.5},
    config: springConfigs.quick,
  });

  return renderFn(
    (props, shown) =>
      shown && (
        <Col
          position="fixed"
          top="0"
          left="0"
          height="100%"
          width="100%"
          align="center"
          justify="center"
          px={4}
          pa={5}
          zIndex={3}
          overflow="hidden"
        >
          <Box styleChild absolute bg="backdrop" top="0" left="0" right="0" bottom="0">
            <animated.div
              style={{
                opacity: props.opacity,
                pointerEvents: props.opacity.to((val) => (val > 0.3 ? "auto" : "none")),
              }}
              onClick={onClose}
            />
          </Box>
          <Col styleChild bg="front" rounded="md" relative width="100%" maxWidth="28rem">
            <animated.div style={props}>
              <ContentComp onClose={onClose} />
            </animated.div>
          </Col>
        </Col>
      )
  );
};

export default Overlay;
