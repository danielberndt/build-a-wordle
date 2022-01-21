import {ReactNode} from "react";
import {Box} from "./Box";
import {pillThemes} from "./Pill.css";

type PillProps = {
  type: keyof typeof pillThemes;
  children: ReactNode;
};

export const Pill = ({type, children}: PillProps) => (
  <Box
    className={pillThemes[type]}
    rounded="md"
    px={4}
    py={2}
    align="center"
    bg="subTheme"
    color="subTheme"
    borderWidth={2}
    bold
    borderColor="subTheme"
    textAlign="center"
  >
    {children}
  </Box>
);
