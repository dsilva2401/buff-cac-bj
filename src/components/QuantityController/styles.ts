import { theme } from 'styles/theme';
import styled from 'styled-components';

export const NumberInput = styled.input`
  width: 70px;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;

  border: 1px solid #e7eaeb;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
    color: #000;
  }
`;

type ControllerButtonProps = {
  disabled: boolean;
};

export const ControllerButton = styled.button<ControllerButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${(props) => (props.disabled ? '#e7eaeb' : theme.primary)};
  background-color: ${(props) => (props.disabled ? '#e7eaeb' : theme.primary)};
  transition: all 0.3s ease;

  svg {
    path {
      fill: ${(props) => (props.disabled ? '#b1b1b1' : '#fff')};
      transition: fill 0.3s ease;
    }
  }
`;
