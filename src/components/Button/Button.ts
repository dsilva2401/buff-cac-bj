import styled from 'styled-components';
import { theme } from 'styles/theme';

type ButtonProps = {
  variant: 'light' | 'dark';
  warning?: boolean;
  squared?: boolean;
  width?: string;
  margin?: string;
  disabled?: boolean;
  iconRight?: boolean;
  inlineIcon?: boolean;
  transition?: string;
  brandTheme?: string;
  alignItems?: string;
};

const hex2rgba = (hex: any, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x: any) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

const Button = styled.button<ButtonProps>`
  position: relative;
  display: flex;
  gap: 0.25rem;
  flex-direction: row;
  justify-content: center;
  align-items: ${(props) => (props.alignItems ? props.alignItems : 'center')};
  font-size: 1rem;
  line-height: 1.2rem;
  height: 52px;
  padding: 0.9rem 0.75rem;
  font-weight: 600;
  cursor: pointer;
  margin: ${(props) => (props.margin ? props.margin : '0')};
  transition: ${(props) =>
    props.transition ? props.transition : 'all 0.3s ease'};
  width: ${(props) => (props.width ? props.width : '100%')};
  border-radius: ${(props) => (props.squared ? '0.5rem' : '5rem')};
  border: ${(props) =>
    props.variant === 'light'
      ? `1px solid ${hex2rgba(props.brandTheme || theme.button.border, 0.5)}`
      : 'none'};
  background-color: ${(props) =>
    props.variant === 'dark'
      ? props.warning
        ? theme.button.warning
        : props.brandTheme || theme.button.primary
      : theme.button.secondary};
  box-shadow: ${(props) =>
    props.variant === 'dark' ? '' : '0px 1px 4px rgba(0, 0, 0, 0.12)'};
  color: ${(props) =>
    props.variant === 'dark'
      ? theme.button.secondary
      : props.warning
      ? theme.button.warning
      : props.brandTheme || theme.button.primary};

  @media only screen and (max-width: 340px) {
    font-size: 0.8rem;
  }

  a {
    color: ${(props) =>
      props.variant === 'dark'
        ? theme.button.secondary
        : props.warning
        ? theme.button.warning
        : props.brandTheme || theme.button.primary};
    text-decoration: none;
  }

  svg {
    position: ${(props) => (props.inlineIcon ? 'relative' : 'absolute')};
    ${(props) =>
      props.iconRight ? `right: 1rem;` : props.inlineIcon ? '' : `left: 1rem;`};
    border-radius: 50%;
    @media only screen and (max-width: 340px) {
      width: 18px;
      height: 18px;
    }
  }

  &:active {
    box-shadow: ${(props) =>
      props.variant === 'dark' ? '' : '-1px -1px 4px rgba(0, 0, 0, 0.12)'};
  }

  &:disabled {
    background-color: ${(props) =>
      props.variant === 'dark' ? '#ccc' : theme.button.secondary};
    color: ${(props) =>
      props.variant === 'dark'
        ? theme.button.secondary
        : theme.button.disabled};
  }
`;

export default Button;
