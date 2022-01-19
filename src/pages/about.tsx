import {render} from "preact";
import {Box, Col} from "../Box";
import "../global-styles.css";

const About = () => (
  <Col>
    <Box as="h1" bold>
      About!!!
    </Box>
  </Col>
);

export default About;
