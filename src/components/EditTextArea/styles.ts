import styled from 'styled-components';

type InputProps = {
  isFocused: boolean;
  width?: string;
  height?: string;
};

export const InputWrapper = styled.div<InputProps>`
  font-size: 1rem;
  padding: 0.8rem 1.5rem;
  display: flex;
  align-items: center;
  width: 100%;
  height: ${(props) => (props.height ? props.height : 'inherit')};
  position: relative;
  border-radius: 30px;
  background: #f4f4f4;
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
      background: #f4f4f4;
      outline: none;
    }
  }
`;

export const InputPlaceholder = styled.span<InputProps>`
  position: absolute;
  color: #98a3aa;
  z-index: 1;
  font-weight: 400;
  font-size: 0.8rem;
  background-color: ${(props) => (props.isFocused ? '#FFFFFF' : 'transparent')};
  opacity: ${(props) => (props.isFocused ? 1 : 0.85)};
  top: 10px;
`;
