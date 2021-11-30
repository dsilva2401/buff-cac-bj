import styled from "styled-components";

type UploadInputProps = {
  isFocused: boolean;
  isFileSelected: boolean;
};

export const InputWrapper = styled.div<UploadInputProps>`
  width: 100%;
  padding: 0.8rem 1.5rem;
  display: flex;
  position: relative;
  align-items: center;
  background-color: ${(props) =>
    props.isFileSelected || props.isFocused ? "transparent" : "#f4f4f4"};
  border: 1px solid
    ${(props) =>
      props.isFileSelected || props.isFocused ? "#1b1b1b" : "transparent"};
  border-radius: 30px;
  transition: all 0.3s ease;
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  label {
    width: 100%;
    height: 1.8rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    color: #000;
    background: transparent;
    position: relative;
    z-index: 2;
  }
  svg {
    position: absolute;
    right: 1rem;
    z-index: ${(props) => (props.isFileSelected ? 3 : 1)};
    opacity: ${(props) => (props.isFileSelected || props.isFocused ? 1 : 0.3)};
    transition: opacity 0.3s ease;

    path {
      fill: #000;
    }
  }
`;

export const InputPlaceholder = styled.span<UploadInputProps>`
  position: absolute;
  padding: 0
    ${(props) => (props.isFileSelected || props.isFocused ? "0.6rem" : "0")};
  color: ${(props) =>
    props.isFileSelected || props.isFocused ? "#000" : "rgba(0, 0, 0, 0.54)"};
  transition: all 0.3s ease;
  z-index: 1;
  font-size: ${(props) =>
    props.isFocused || props.isFileSelected ? "0.85rem" : "0.9rem"};
  background-color: ${(props) =>
    props.isFocused || props.isFileSelected ? "#fff" : "transparent"};
  transform: ${(props) =>
    props.isFocused || props.isFileSelected
      ? "scale(0.8) translate(-25px, -35px)"
      : "unset"};
`;
