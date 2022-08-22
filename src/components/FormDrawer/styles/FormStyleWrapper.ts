import styled from 'styled-components';

type FormStyleWrapperProps = {
  brandTheme: string;
};

const FormStyleWrapper = styled.div<FormStyleWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  .Mui-checked {
    color: ${(props) => (props.brandTheme ? `${props.brandTheme}` : 'black')};
    svg {
      fill: ${(props) =>
        props.brandTheme ? `${props.brandTheme} !important` : 'black'};
    }
  }

  Label {
    color: black;
  }
`;

export default FormStyleWrapper;
