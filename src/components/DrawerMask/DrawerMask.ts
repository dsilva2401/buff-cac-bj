import styled from "styled-components";

type DrawerMaskProps = {
  isDrawerOpen: boolean;
  zIndex?: number;
};

const DrawerMask = styled.button<DrawerMaskProps>`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: ${(props) => (props.isDrawerOpen ? 1 : 0)};
  z-index: ${(props) =>
    props.isDrawerOpen ? (props.zIndex ? props.zIndex : 2) : -1};
  transition: all 0.3s ease;
  pointer-events: none;
`;

export default DrawerMask;
