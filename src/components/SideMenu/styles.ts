import styled from "styled-components";
import { theme } from "styles/theme";

type MenuProps = {
  isMenuOpen: boolean;
};

const Menu = styled.div<MenuProps>`
  width: ${(props) => (props.isMenuOpen ? "80%" : "0%")};
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 26px 0 0 0;
  box-shadow: 0px 16px 40px rgba(0, 0, 0, 0.08);
  background-color: ${theme.primary};
  z-index: 10;
  transition: all 0.4s ease;

  div {
    width: 100%;
    height: 100%;
    display: ${(props) => (props.isMenuOpen ? "flex" : "none")};
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    padding: 2rem 2rem 3rem;
    gap: 3rem;

    span {
      width: 100%;
      display: flex;
      justify-content: flex-end;

      button {
        background-color: unset;
        cursor: pointer;
      }
    }

    nav {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-end;
      gap: 1.2rem;
      a, span, p {
        cursor: pointer;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        font-size: 1.1rem;
        text-decoration: unset;
        white-space: nowrap;
      }
    }
  }
`;

export default Menu;
