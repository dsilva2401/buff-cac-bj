import styled from "styled-components";

type ButtonProps = {
  theme: "dark" | "light";
};

const Button = styled.button<ButtonProps>`
  height: 54px;
  width: 54px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.theme === "dark" ? "#1B1B1B" : "#FFF")};
  box-shadow: ${(props) =>
    props.theme === "dark" ? "" : "0px 1px 4px rgba(0, 0, 0, 0.12)"};
  color: ${(props) => (props.theme === "dark" ? "#FFF" : "#414149")};
  transition: all 0.3s ease;

  svg {
    fill: ${(props) => (props.theme === "dark" ? "#FFF" : "#414149")};
  }

  &:active {
    box-shadow: ${(props) =>
      props.theme === "dark" ? "" : "-1px -1px 4px rgba(0, 0, 0, 0.12)"};
  }
`;

export default Button;
