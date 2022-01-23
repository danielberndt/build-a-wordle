import {ReactNode} from "react";
import {Box, StyleProps} from "./Box";
import {buttonStyles, iconButtonStyle} from "./Button.css";

export type ButtonStyleProps = {
  theme?: keyof typeof buttonStyles;
  children: ReactNode;
} & StyleProps;

export const ButtonStyle = ({theme = "neutral", ...rest}: ButtonStyleProps) => (
  <Box
    styleChild
    rounded="md"
    borderWidth={2}
    bold
    textTransform="uppercase"
    fontSize="md"
    userSelect="none"
    px={4}
    py={2}
    className={buttonStyles[theme]}
    {...rest}
  />
);

export const BaseButton = ({
  theme,
  ...props
}: JSX.IntrinsicElements["button"] & Pick<ButtonStyleProps, "theme">) => {
  return (
    <ButtonStyle theme={theme}>
      <button type="button" {...props} />
    </ButtonStyle>
  );
};

export type IconButtonStyleProps = {
  children: ReactNode;
} & StyleProps;

export const IconButtonStyle = (props: IconButtonStyleProps) => (
  <Box
    styleChild
    rounded="md"
    bg="transparent"
    borderWidth={0}
    fontSize="md"
    userSelect="none"
    className={iconButtonStyle}
    {...props}
  />
);

export const IconButton = ({children, ...props}: JSX.IntrinsicElements["button"]) => {
  return (
    <IconButtonStyle>
      <button type="button" {...props}>
        <Box styleChild width="1em" height="1em" display="block">
          {children}
        </Box>
      </button>
    </IconButtonStyle>
  );
};
