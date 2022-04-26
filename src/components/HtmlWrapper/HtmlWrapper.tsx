import styled from 'styled-components';
import Wrapper from 'components/Wrapper';

const HtmlWrapper = styled(Wrapper)`
  position: relative;
  animation: fade-in 0.6s ease-in-out forwards;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  hr {
    width: 100%;
    height: 1px;
    background: #98a3aa;
    margin: 6px 0;
  }
  pre {
    font-family: monospace;
  }
  .fr-box.fr-basic .fr-element p {
    margin: 0px 0 !important;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  ul,
  ol {
    font-size: 12px;
    line-height: 18px;
    margin: 0;
    padding-left: 1.5rem;
    strong {
      color: #98a3aa;
      margin: 0;
      padding: 0;
    }
  & .iframe-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%;
    border-radius: 10px;
    height: 0;
  }
  & .ql-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  & .ql-align-right {
    text-align: right;
    width: 100%;
  }
  & .ql-align-left {
    text-align: left;
    width: 100%;
  }
  & .ql-align-center {
    text-align: center;
    width: 100%;
  }
  & .ql-align-justify {
    text-align: justify;
    width: 100%;
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
    text-decoration: none !important;
  }
  p {
    font-size: 12px;
    line-height: 18px;
    margin: 0;
    padding: 0;
  }
  .fr-rounded {
    margin: 4px 0px;
    border-radius: 10px;
  }
  .fr-shadow {
    box-shadow: 10px 10px 5px 0px #cccccc !important;
  }
`;

export default HtmlWrapper;
