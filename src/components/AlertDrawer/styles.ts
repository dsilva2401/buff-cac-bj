import styled from "styled-components";

type DrawerProps = {
  isDrawerOpen: boolean;
  zIndex?: number;
};

export const Drawer = styled.div<DrawerProps>`
  width: 100%;
  height: ${(props) => (props.isDrawerOpen ? "390px" : 0)};
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #fff;
  border-radius: 25px 25px 0 0;
  z-index: 3;
  transition: all 0.3s ease;

  div {
    display: ${(props) => (props.isDrawerOpen ? "flex" : "none")};
  }
`;
