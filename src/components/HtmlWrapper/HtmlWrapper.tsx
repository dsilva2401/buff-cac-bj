import styled from 'styled-components';
import Wrapper from 'components/Wrapper';

const HtmlWrapper = styled(Wrapper)`
  animation: fade-in 0.6s ease-in-out forwards;
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  ul {
    padding-left: 1.25rem;
  }
  ul {
    padding-left: 1.25rem;
  }
  & .ql-size-large {
    cursor: pointer;
    font-weight: 500 !important;
    font-size: 18px !important;
    color: #ffffff !important;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto 0;
    height: 52px;
    background: #0a0b0a;
    border-radius: 50px;
    text-decoration: none !important;
  }
  p {
    font-size: 12px;
    line-height: 18px;
    margin: 0;
    padding: 0;
    strong {
      color: #98a3aa;
      margin: 0;
      padding: 0;
    }
  }
  img {
    margin: 12px 0px;
    border-radius: 12px;
  }
  iframe {
    border-radius: 12px;
  }
`;

export default HtmlWrapper;
