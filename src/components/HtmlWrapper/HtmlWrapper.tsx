import styled from 'styled-components';
import Wrapper from 'components/Wrapper';

const HtmlWrapper = styled(Wrapper)`
  position: relative;
  animation: fade-in 0.6s ease-in-out forwards;
  word-break: break-word;
  white-space: pre-wrap;
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
  & .fr-box.fr-basic .fr-element p {
    margin: 0px 0 !important;
  }
  & .fr-size-large {
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
  & .fr-text-spaced {
    letter-spacing: 0.1em;
  }
  & .fr-text-uppercase {
    text-transform: uppercase;
  }
  & .fr-text-bordered {
    border-top: 1px solid rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);
    padding: 8px 0px;
  }
  & .fr-text-gray {
    color: #7d7d7d;
    margin: 0 !important;
    padding: 0;
  }
  & .fr-rounded {
    margin: 4px 0px;
    border-radius: 10px;
  }
  & .fr-shadow {
    box-shadow: 10px 10px 5px 0px #cccccc !important;
  }
  & .fr-emoticon {
    width: 24px;
    height: 24px;
    padding: 0 7px;
    position: relative;
    background-repeat: no-repeat !important;
    background-position: center !important;
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
  }
  .fr-video {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    border-radius: 10px;
    display: block;

    video,
    iframe {
      position: absolute !important;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100% !important;
      height: 100% !important;
      border-radius: 10px;
    }
  }
  & .iframe-wrapper {
    position: relative;
    width: 100%;
    height: 0;
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
    border-radius: 26px;
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
    line-height: auto;
    margin: 0;
    padding: 0;
  }
`;

export default HtmlWrapper;
