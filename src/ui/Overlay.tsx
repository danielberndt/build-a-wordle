import {createContext, ReactNode, useContext, useEffect, useLayoutEffect, useRef} from "react";
import create from "zustand";
import {animated, useTransition} from "react-spring";
import {springConfigs} from "../animation-utils";
import {Box, Col} from "./Box";

type ReadOverlayStoreState = {
  key: string | null;
  overlayElement: ReactNode | null;
  onClose: null | (() => void);
  hasCustomStyle?: boolean;
};
const emptyState: ReadOverlayStoreState = {
  key: null,
  overlayElement: null,
  onClose: null,
};

const useOverlayStore = create<
  ReadOverlayStoreState & {set: (state: ReadOverlayStoreState) => void}
>((set) => ({
  ...emptyState,
  set,
}));

type UseOverlayArgs = NonNullable<ReadOverlayStoreState> | null | false | undefined;
export const useOverlay = (args: UseOverlayArgs) => {
  const refs = useRef(args);
  const set = useOverlayStore((s) => s.set);
  useLayoutEffect(() => {
    refs.current = args;
  });
  const key = (args && args.key) || null;
  useLayoutEffect(() => {
    if (key && refs.current) {
      set(refs.current);
      return () => set(emptyState);
    }
  }, [key, set]);
};

const OverlayAnimPropsContext = createContext<any>(null);
export const useOverlayAnimProps = () => useContext(OverlayAnimPropsContext);

const OverlayProvider = () => {
  const {key, overlayElement, onClose, hasCustomStyle} = useOverlayStore();

  const renderFn = useTransition(
    {overlayElement, onClose, hasCustomStyle},
    {
      key: key || "none",
      from: {opacity: 0, scale: 0.85, y: "2rem"},
      enter: {opacity: 1, scale: 1, y: "0rem"},
      leave: {opacity: 0, scale: 0.5},
      config: springConfigs.quick,
    }
  );

  useEffect(() => {
    (window.document.activeElement as any)?.blur();
  }, [key]);

  return renderFn(
    (props, currItem) =>
      currItem.overlayElement && (
        <Col
          styleChild
          position="fixed"
          top="0"
          left="0"
          height="100%"
          width="100%"
          zIndex={3}
          overflow="hidden"
        >
          <animated.div
            style={{pointerEvents: props.opacity.to((val) => (val > 0.3 ? "auto" : "none"))}}
          >
            <Box styleChild absolute bg="backdrop" top="0" left="0" right="0" bottom="0">
              <animated.div
                style={{opacity: props.opacity}}
                onClick={currItem.onClose || undefined}
              />
            </Box>
            {currItem.hasCustomStyle ? (
              <OverlayAnimPropsContext.Provider value={props}>
                {currItem.overlayElement}
              </OverlayAnimPropsContext.Provider>
            ) : (
              <Col
                align="center"
                justify="center"
                px={4}
                pa={5}
                minHeight="0"
                minWidth="0"
                fillParent
              >
                <Col
                  styleChild
                  bg="front"
                  rounded="md"
                  relative
                  width="100%"
                  maxWidth="28rem"
                  maxHeight="100%"
                  overflow="auto"
                >
                  <animated.div style={props}>{currItem.overlayElement}</animated.div>
                </Col>
              </Col>
            )}
          </animated.div>
        </Col>
      )
  );
};

export default OverlayProvider;
