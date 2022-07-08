import styled from 'styled-components';

type AppContainerProps = {
  isBrowser: boolean;
};

const AppContainer = styled.div<AppContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isBrowser ? '#F5F5F5' : '#FFFFFF')};
  @media screen and (orientation: landscape) {
    #landscape {
      display: flex;
    }
    #portrait {
      display: none;
    }
  }
  @media screen and (orientation: portrait) {
    #landscape {
      display: none;
    }
    #portrait {
      display: flex;
    }
  }
`;

export default AppContainer;
