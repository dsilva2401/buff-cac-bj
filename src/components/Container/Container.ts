import styled from 'styled-components';

type ContainerProps = {
  isBrowser: boolean;
};

const Container = styled.div<ContainerProps>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.isBrowser ? '#F5F5F5' : '#FFFFFF')};
`;

export default Container;
