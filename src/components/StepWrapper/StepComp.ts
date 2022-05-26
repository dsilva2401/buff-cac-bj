import styled from 'styled-components';

type WrapperProps = {
  background?: string;
};

const StepComp = styled.div<WrapperProps>`
  background: ${(props) => (props.background ? props.background : 'unset')};
`;

export default StepComp;
