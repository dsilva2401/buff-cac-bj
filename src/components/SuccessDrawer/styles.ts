import styled from 'styled-components';
import { theme } from 'styles/theme';

type DrawerType = {
  isOpen?: boolean;
  brandTheme?: string;
  appZoom?: number;
};

export const Drawer = styled.div<DrawerType>`
  width: 101%;
  height: ${(props) => `calc(100vh / ${props.appZoom})`};
  position: absolute;
  padding: 30% 3rem 50%;
  top: 9999px;
  left: 0;
  border-radius: 26px 26px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  background-color: ${(props) => props.brandTheme || theme.primary};
  z-index: 999;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'translateY(-10000px)' : 'none')};

  span {
    width: 25%;
    margin: 0 auto;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${(props) => props.brandTheme || theme.primary};
    left: 0;
    bottom: -100%;
  }
`;
