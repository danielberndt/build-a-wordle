import {ComponentChildren} from "preact";
import {Col} from "./ui/Box";
import {frameStyle} from "./Frame.css";

const Frame = ({children}: {children: ComponentChildren}) => {
  return (
    <Col bg="back" fillParent align="center" justify="center">
      <Col bg="front" width="100%" height="100%" overflow="hidden" className={frameStyle}>
        {children}
      </Col>
    </Col>
  );
};

export default Frame;
