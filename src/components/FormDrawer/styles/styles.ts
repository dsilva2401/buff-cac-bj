import styled from 'styled-components';

type InputProps = {
  isFocused: boolean;
  width?: string;
};

export const DropDownWrapper = styled.div<InputProps>`
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid #e7eaeb;
  border-radius: 30px;
  transition: all 0.3s ease;
  background: ${(props) => (props.isFocused ? 'transparent' : '#f4f4f4')};
  width: ${(props) => (props.width ? props.width : '100%')};
   height: 100px;
  }
`;

export const DropDownSelection = styled.div<InputProps>`
  position: absolute;
  height: 300px;
  background: red;
  width: 100%;
  bottom: 0px;
`;

export const InputPlaceholder = styled.span<InputProps>`
  position: absolute;
  color: #98a3aa;
  transition: all 0.3s ease;
  z-index: 1;
  font-size: ${(props) => (props.isFocused ? '0.7rem' : '0.9rem')};
  background-color: ${(props) => (props.isFocused ? '#FFFFFF' : 'transparent')};
  transform: ${(props) =>
    props.isFocused ? 'scale(0.8) translate(-10px, -30px)' : 'unset'};
  opacity: ${(props) => (props.isFocused ? 1 : 0.85)};
`;
