import styled from 'styled-components';
import Wrapper from 'components/Wrapper';

const HtmlWrapper = styled(Wrapper)`
  a {
    cursor: pointer;
    font-weight: 500 !important;
    font-size: 18px !important;
    color: #FFFFFF !important;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto 0;
    height: 52px;
    background: #0A0B0A;
    border-radius: 50px;
    text-decoration: none !important;
  }
`;

export default HtmlWrapper;
