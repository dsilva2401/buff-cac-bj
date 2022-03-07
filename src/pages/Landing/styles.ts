import styled from 'styled-components';

type LandingHtmlWrapperProps = {
  color?: string;
};

export const LandingHtmlWrapper = styled.div<LandingHtmlWrapperProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  label {
    color: #1c3965;
    opacity: 0.9;
  }
  p {
    opacity: 0.9;
    color: #1c3965;
    font-size: 18px;
  }
  strong {
    color: #000000;
    font-weight: 700;
  }
  ul {
    list-style: none;
  }
  li {
    display: flex;
    align-items: flex-start;
    margin: 0.25rem 0;
    gap: 0.375rem;
  }
`;
