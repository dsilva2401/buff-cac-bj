import styled from 'styled-components';

type InputProps = {
  isFocused: boolean;
  width?: string;
};

export const InputWrapper = styled.div<InputProps>`
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  width: 100%;
  border: 2px solid #e7eaeb;
  position: relative;
  border-radius: 30px;
  background: ${(props) => (props.isFocused ? 'transparent' : '#f4f4f4')};
  textarea {
    width: 100%;
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
  z-index: 1;
  font-size: 0.7rem;
  background-color: ${(props) => (props.isFocused ? '#FFFFFF' : 'transparent')};
  opacity: ${(props) => (props.isFocused ? 1 : 0.85)};
  top: 10px;
`;
