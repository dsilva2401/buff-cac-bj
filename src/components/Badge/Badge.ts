import styled from 'styled-components';
import { theme } from 'styles/theme';

type BadgeProps = {
  variant: 'light' | 'dark';
  warning?: boolean;
  squared?: boolean;
  width?: string;
  height?: string;
  iconRight?: boolean;
  inlineIcon?: boolean;
  transition?: string;
  brandTheme?: string;
  marginTop?: string;
  background?: string;
  fontSize?: string;
};

const hex2rgba = (hex: any, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x: any) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

const Badge = styled.button<BadgeProps>`
  position: absolute;
  left: calc(50% - 70px);
  display: flex;
  gap: 0.25rem;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '1rem')};
  font-weight: 600;
  width: ${(props) => (props.width ? props.width : '100%')};
  height: ${(props) => (props.height ? props.height : '100%')};
  cursor: pointer;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '')};
  transition: ${(props) =>
    props.transition ? props.transition : 'all 0.3s ease'};
  border-radius: ${(props) => (props.squared ? '0.5rem' : '5rem')};
  border: ${(props) =>
    props.variant === 'light'
      ? `1px solid ${hex2rgba(props.brandTheme || theme.button.border, 0.5)}`
      : 'none'};
  background-size: ${(props) => (props.background ? 'cover' : 'auto')};
  background-color: ${(props) =>
    props.background
      ? 'transparent'
      : props.variant === 'dark'
      ? props.warning
        ? theme.button.warning
        : props.brandTheme || theme.button.primary
      : theme.button.secondary};
  background-image: url(${(props) => props.background});
  box-shadow: ${(props) =>
    props.variant === 'dark' ? '' : '0px 1px 4px rgba(0, 0, 0, 0.12)'};
  color: ${(props) =>
    props.variant === 'dark'
      ? theme.button.secondary
      : props.warning
      ? theme.button.warning
      : props.brandTheme || theme.button.primary};

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
    position: absolute;
    border-radius: 50%;
    ${(props) =>
      props.iconRight ? `right: 1rem;` : props.inlineIcon ? '' : `left: 1rem;`};
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

export default Badge;
