import styled from 'styled-components';

type FormStyleWrapperProps = {
  brandTheme: string;
};

const FormStyleWrapper = styled.div<FormStyleWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  .Mui-checked {
    path {
      color: ${(props) =>
        props.brandTheme ? `${props.brandTheme} !important` : 'unset'};
    }
  }

  Label {
    color: black;
  }
`;

export default FormStyleWrapper;
