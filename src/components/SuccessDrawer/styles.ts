import styled from 'styled-components';
import { theme } from 'styles/theme';

type DrawerType = {
  isOpen?: boolean;
  brandTheme?: string;
  appZoom?: number;
};

export const Drawer = styled.div<DrawerType>`
  width: 101%;
  height: 80%;
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
  border-radius: 26px 26px 0px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: ${(props) => props.brandTheme || theme.primary};
  z-index: 999;
  transition: bottom 1s ease;
  bottom: ${(props) => (props.isOpen ? '1px' : '-80%')};

  span {
    width: 25%;
    margin: 0 auto;
  }
`;
