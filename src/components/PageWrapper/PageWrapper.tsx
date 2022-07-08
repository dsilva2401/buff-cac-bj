import styled from 'styled-components';
import Wrapper from 'components/Wrapper';

type PageWrapperProps = {
  isPreviewMode?: boolean;
};

const PageWrapper = styled(Wrapper)<PageWrapperProps>`
  position: absolute;
  direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  max-height: ${(props) => (props.isPreviewMode ? 'unset' : '100vh')};
  overflow: hidden;
  @media (min-width: 1024px) {
    min-width: 350px;
    max-width: ${window.innerHeight * (9 / 16)}px;
    max-height: ${window.innerHeight}px;
  }
`;

export default PageWrapper;
