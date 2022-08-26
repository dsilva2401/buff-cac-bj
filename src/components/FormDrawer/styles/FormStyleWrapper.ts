import styled from 'styled-components';

type FormStyleWrapperProps = {
  brandTheme: string;
};

const FormStyleWrapper = styled.div<FormStyleWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  .form-radio {
    .MuiTypography-body1 {
      font-weight: 600;
    }
  }

  .Mui-checked {
    color: ${(props) => (props.brandTheme ? `${props.brandTheme}` : '#000')};
    svg {
      fill: ${(props) =>
        props.brandTheme ? `${props.brandTheme} !important` : '#000'};
    }
  }

  Label {
    color: black;
  }

  .form-checkbox-label {
    font-weight: 600;
  }
`;

export default FormStyleWrapper;
