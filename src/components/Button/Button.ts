import styled from "styled-components";

type ButtonProps = {
  theme: "light" | "dark";
  warning?: boolean;
};

const Button = styled.button<ButtonProps>`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.9rem 0;
  border-radius: 5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: ${(props) =>
    props.theme === "light" ? "1px solid #E7EAEB" : "none"};
  background-color: ${(props) =>
    props.theme === "dark" ? (props.warning ? "#FD6157" : "#1B1B1B") : "#FFF"};
  box-shadow: ${(props) =>
    props.theme === "dark" ? "" : "0px 1px 4px rgba(0, 0, 0, 0.12)"};
  color: ${(props) =>
    props.theme === "dark" ? "#FFF" : props.warning ? "#FD6157" : "#202029"};

  a {
    color: ${(props) =>
      props.theme === "dark" ? "#FFF" : props.warning ? "#FD6157" : "#202029"};
    text-decoration: none;
  }

  svg {
    position: absolute;
    left: 1rem;
    border-radius: 50%;
  }

  &:active {
    box-shadow: ${(props) =>
      props.theme === "dark" ? "" : "-1px -1px 4px rgba(0, 0, 0, 0.12)"};
  }

  &:disabled {
    background-color: ${(props) => (props.theme === "dark" ? "#ccc" : "#fff")};
    color: ${(props) =>
      props.theme === "dark" ? "#fff" : "rgba(32, 32, 41, .3)"};
  }
`;

export default Button;
