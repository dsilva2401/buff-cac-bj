import styled from 'styled-components';
import { theme } from 'styles/theme';

type ButtonProps = {
  variant: 'light' | 'dark';
  warning?: boolean;
  squared?: boolean;
  width?: string;
};

const Button = styled.button<ButtonProps>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.9rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  width: ${(props) => props.width ? props.width : '100%'};
  border-radius: ${(props) => props.squared ? '0.5rem' : '5rem'};
  border: ${(props) =>
    props.variant === 'light' ? `1px solid ${theme.button.border}` : 'none'};
  background-color: ${(props) =>
    props.variant === 'dark' ? (props.warning ? theme.button.warning : theme.button.primary) : theme.button.secondary};
  box-shadow: ${(props) =>
    props.variant === 'dark' ? '' : '0px 1px 4px rgba(0, 0, 0, 0.12)'};
  color: ${(props) =>
    props.variant === 'dark' ? theme.button.secondary : props.warning ? theme.button.warning : theme.button.primary};

  a {
    color: ${(props) =>
    props.variant === 'dark' ? theme.button.secondary : props.warning ? theme.button.warning : theme.button.primary};
    text-decoration: none;
  }

  svg {
    position: absolute;
    left: 1rem;
    border-radius: 50%;
  }

  &:active {
    box-shadow: ${(props) =>
    props.variant === 'dark' ? '' : '-1px -1px 4px rgba(0, 0, 0, 0.12)'};
  }

  &:disabled {
    background-color: ${(props) => (props.variant === 'dark' ? '#ccc' : theme.button.secondary)};
    color: ${(props) =>
    props.variant === 'dark' ? theme.button.secondary : theme.button.disabled};
  }
`;

export default Button;
