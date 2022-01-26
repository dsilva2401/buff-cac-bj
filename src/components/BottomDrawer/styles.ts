import styled from 'styled-components';

type DrawerProps = {
  isControlled: boolean;
};

type DrawerHeaderProps = {
  isChildOpen: boolean;
};

export const Drawer = styled.div<DrawerProps>`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #FFFFFF;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  width: ${(props) => (props.isChildOpen ? 'max-content' : '100%')};
  position: ${(props) => (props.isChildOpen ? 'absolute' : 'relative')};
  ${(props) => {
    if (props.isChildOpen) {
      return `top: 0; right: 0; z-index: 10;`;
    }
  }}
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
  background-color: #f7f7f7;
  border-radius: 50%;
  display: flex;
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
  margin-left: auto;
  margin-right: auto;
  border-radius: 7px;
  background: #CBD1D4;
`;
