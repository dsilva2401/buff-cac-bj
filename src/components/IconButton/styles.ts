import styled from "styled-components";
import { theme } from "styles/theme";

type ButtonProps = {
  variant: "dark" | "light";
};

const Button = styled.button<ButtonProps>`
  height: 54px;
  width: 54px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.variant === "dark" ? theme.button.primary : theme.button.secondary)};
  box-shadow: ${(props) =>
    props.variant === "dark" ? "" : "0px 1px 4px rgba(0, 0, 0, 0.12)"};
  color: ${(props) => (props.variant === "dark" ? theme.button.secondary : theme.button.primary)};
  transition: all 0.3s ease;

  svg {
    fill: ${(props) => (props.variant === "dark" ? theme.button.secondary : theme.button.primary)};
  }

  &:active {
    box-shadow: ${(props) =>
    props.variant === "dark" ? "" : "-1px -1px 4px rgba(0, 0, 0, 0.12)"};
  }
`;

export default Button;
