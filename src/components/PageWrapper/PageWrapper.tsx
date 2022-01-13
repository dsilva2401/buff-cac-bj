import styled from "styled-components";
import Wrapper from "components/Wrapper";

const PageWrapper = styled(Wrapper)`
  position: fixed;
  direction: column;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  @media (min-width: 1024px) {
    position: relative;
    max-width: 375px;
  }
`;

export default PageWrapper;
