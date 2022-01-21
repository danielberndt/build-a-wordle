import {ReactNode} from "react";
import {Box, StyleProps} from "./Box";
import {buttonThemes} from "./button.css";

export type ButtonStyleProps = {
  theme?: keyof typeof buttonThemes;
  children: ReactNode;
} & StyleProps;

export const ButtonStyle = ({theme = "neutral", ...rest}: ButtonStyleProps) => (
  <Box
    styleChild
    rounded="md"
    bg="subTheme"
    hoverBg="subTheme"
    borderWidth={2}
    borderColor="subTheme"
    color="subTheme"
    bold
    textTransform="uppercase"
    fontSize="md"
    userSelect="none"
    px={4}
    py={2}
    className={buttonThemes[theme]}
    {...rest}
  />
);

export const BaseButton = ({
  theme,
  ...props
}: JSX.IntrinsicElements["button"] & Pick<ButtonStyleProps, "theme">) => {
  return (
    <ButtonStyle theme={theme}>
      <button type="button" {...props}></button>
    </ButtonStyle>
  );
};
