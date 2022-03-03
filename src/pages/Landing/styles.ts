import styled from 'styled-components';

type LandingHtmlWrapperProps = {
  color?: string;
};

export const LandingHtmlWrapper = styled.div<LandingHtmlWrapperProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 2.875rem 0;
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  label {
    color: #1c3965;
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
