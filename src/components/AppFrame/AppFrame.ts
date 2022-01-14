import styled from 'styled-components';

const AppFrame = styled.div`
  width: 100%;
  height: calc(100%);
  position: relative;
  overflow: hidden;
  background-color: #fff;

  @media (min-width: 1024px) {
    max-width: 375px;
    height: calc(100% - 2rem);
    border-radius: 15px;
    box-shadow: 3px 3px 7px rgb(0 0 0 / 20%);
  }
`;

export default AppFrame;
