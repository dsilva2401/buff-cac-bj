import styled from 'styled-components';

type InputProps = {
  isFocused: boolean;
};

export const InputWrapper = styled.div<InputProps>`
  padding: 0.8rem 1.5rem;
  display: flex;
  position: relative;
  align-items: center;
  background: transparent;
  border: 2px solid #e7eaeb;
  border-radius: 30px;
  transition: all 0.3s ease;
  input {
    border: none;
    outline: none;
    background: none;
    z-index: 2;
    &:focus,
    &:hover,
    &:active {
      outline: none;
    }
  }
`;

export const InputPlaceholder = styled.span<InputProps>`
  position: absolute;
  color: #98a3aa;
  transition: all 0.3s ease;
  z-index: 1;
  font-size: ${(props) => (props.isFocused ? '0.7rem' : '0.9rem')};
  background-color: ${(props) => (props.isFocused ? '#fff' : 'transparent')};
  transform: ${(props) =>
    props.isFocused ? 'scale(0.8) translate(-10px, -30px)' : 'unset'};
`;
