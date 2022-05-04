import styled from 'styled-components';
import Wrapper from 'components/Wrapper';

const PageWrapper = styled(Wrapper)`
  position: absolute;
  direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
  @media (min-width: 1024px) {
    max-width: ${window.innerHeight * 0.46}px;
    max-height: ${window.innerHeight}px;
  }
`;

export default PageWrapper;
