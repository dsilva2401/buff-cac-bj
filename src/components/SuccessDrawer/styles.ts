import styled from 'styled-components';
import { theme } from 'styles/theme';

type DrawerType = {
  isOpen?: boolean;
};

export const Drawer = styled.div<DrawerType>`
  width: 101%;
  height: 101%;
  position: absolute;
  padding: 30% 3rem 50%;
  top: 1000px;
  left: -1px;
  border-radius: 26px 26px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  background-color: ${theme.primary};
  z-index: 5;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'translateY(-1001px)' : 'none')};

  span {
    width: 25%;
    margin: 0 auto;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${theme.primary};
    left: 0;
    bottom: -100%;
  }
`;
