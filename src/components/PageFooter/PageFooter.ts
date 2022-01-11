import styled from "styled-components";

const PageFooter = styled.footer`
  width: 100%;
  height: 80px;
  border-top: 1px solid #e7eaeb;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  padding: 2rem 0;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;

  p,
  a {
    font-size: 0.9rem;
    font-weight: 400;
  }

  a {
    text-decoration: underline;
    &:hover,
    &:active {
      text-decoration: underline;
    }
  }

  @media (min-width: 1024px) {
    max-width: 375px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
`;

export default PageFooter;
