import styled from 'styled-components';

const AppFrame = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #FFFFFF;
  @media (min-width: 1024px) {
    max-width: 375px;
    border-radius: 15px;
    height: calc(100% - 2rem);
    box-shadow: 3px 3px 7px rgb(0 0 0 / 20%);
  }
`;

export default AppFrame;
