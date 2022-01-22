import {ReactNode} from "react";
import {Box} from "./Box";
import {pillStyles} from "./Pill.css";

type PillProps = {
  type: keyof typeof pillStyles;
  children: ReactNode;
};

export const Pill = ({type, children}: PillProps) => (
  <Box
    className={pillStyles[type]}
    rounded="md"
    px={4}
    py={2}
    align="center"
    borderWidth={2}
    bold
    textAlign="center"
  >
    {children}
  </Box>
);
