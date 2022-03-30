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
`;

export default AppContainer;
