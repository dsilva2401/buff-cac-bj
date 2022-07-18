import styled from 'styled-components';

type WrapperProps = {
  background?: string;
  animation?: string;
};

const StepComp = styled.div<WrapperProps>`
  background: ${(props) => (props.background ? props.background : 'unset')};
  width: ${(props) => (props.animation ? props.animation : '100%')};
`;

export default StepComp;
