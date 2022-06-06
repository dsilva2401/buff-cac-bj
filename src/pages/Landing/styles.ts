import styled from 'styled-components';

type LandingHtmlWrapperProps = {
  color?: string;
};

export const LandingHtmlWrapper = styled.div<LandingHtmlWrapperProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.875rem 2rem;
  text-align: center;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 32px;
    line-height: 44px;
    letter-spacing: 0.5px;
    font-weight: 700;
    color: #243762;
    margin-bottom: 0.75rem;
  }
  label,
  span,
  p {
    color: #243762;
    font-size: 14px;
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
