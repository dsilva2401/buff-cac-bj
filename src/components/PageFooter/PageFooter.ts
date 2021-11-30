import styled from "styled-components";

const PageFooter = styled.footer`
  width: 100%;
  border-top: 1px solid #e7eaeb;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
  padding: 2rem 0;
  background-color: #ffff;

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
`;

export default PageFooter;
