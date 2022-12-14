import styled from 'styled-components';

type InputProps = {
  isFocused: boolean;
  width?: string;
};

export const InputWrapper = styled.div<InputProps>`
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  border: 2px solid #e7eaeb;
  border-radius: 30px;
  transition: all 0.3s ease;
  background: ${(props) => (props.isFocused ? 'transparent' : '#f4f4f4')};
  width: ${(props) => (props.width ? props.width : '100%')};
  input {
    width: ${(props) => (props.width ? props.width : '100%')};
    border: none;
    outline: none;
    z-index: 2;
    &:focus {
    }
    ,
    &:hover,
    &:active {
      background: transparent;
      outline: none;
    }
  }
  textarea {
    width: ${(props) => (props.width ? props.width : '100%')};
    border: none;
    outline: none;
    z-index: 2;
    &:focus {
    }
    ,
    &:hover,
    &:active {
      background: transparent;
      outline: none;
    }
  }
`;

export const InputPlaceholder = styled.span<InputProps>`
  position: absolute;
  color: #98a3aa;
  transition: 0.3s;
  z-index: 1;
  font-size: ${(props) => (props.isFocused ? '0.5rem' : '0.9rem')};
  line-height: ${(props) => (props.isFocused ? '0.5rem' : '0.9rem')};
  background-color: ${(props) => (props.isFocused ? '#FFFFFF' : 'transparent')};
  transform: ${(props) => (props.isFocused ? 'translate(0, -23px)' : 'unset')};
  opacity: ${(props) => (props.isFocused ? 1 : 0.85)};
`;
