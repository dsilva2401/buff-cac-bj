import styled from 'styled-components';

type DrawerProps = {
  isControlled: boolean;
};

type DrawerHeaderProps = {
  isChildOpen: boolean;
  isDrawerOpen: boolean;
};

export const Drawer = styled.div<DrawerProps>`
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #ffffff;
  border: 1px 0 0 0 solid #e7eaeb;
  box-shadow: 2px -2px 5px rgb(0 0 0 / 6%);
  border-radius: 26px 26px 0px 0px;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 3;
  transition: ${(props) => (props.isControlled ? 'transform 0.3s' : 'none')};
`;

export const DrawerHeader = styled.div<DrawerHeaderProps>`
  display: ${(props) => (props.isChildOpen ? 'none' : 'flex')};
  padding: ${(props) => (props.isDrawerOpen ? '1.25rem 1.5rem' : '0 1.5rem')};
  height: ${(props) => (props.isDrawerOpen ? 'auto' : '5.25rem')};
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const DrawerBody = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0 1rem;
  gap: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const DrawerFooter = styled.div`
  width: 100%;
  padding: 1.5rem 2rem;
  position: relative;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 1rem;
`;

export const DrawerIconLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    border-radius: 50%;
  }
`;

export const DrawerClose = styled.button`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  position: absolute;
  right: 32px;
  top: 16px;
  z-index: 100;
  display: flex;
  border-radius: 50%;
  background-color: #f7f7f7;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  svg {
    fill: #414149;
  }
`;

export const DragBar = styled.div`
  position: absolute;
  width: 45px;
  height: 3px;
  top: 8px;
  left: 0;
  right: 0;
  z-index: 2;
  margin-left: auto;
  margin-right: auto;
  border-radius: 7px;
  background: #cbd1d4;
`;

export const DragZone = styled.div`
  width: 100%;
  height: 70px;
  position: absolute;
  background: transparent;
  top: 0;
`;
