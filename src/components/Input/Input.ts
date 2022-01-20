import styled from 'styled-components';

type InputProps = {
  margin?: string;
};

const Input = styled.input<InputProps>`
  width: 100%;
  margin: ${(props) => (props.margin ? props.margin : 'unset')};
  border-radius: 5rem;
  padding: 1rem 1.5rem;
  background-color: #f4f4f4;

  &::placeholder {
    color: #98a3aa;
    font-size: 0.9rem;
  }
`;

export default Input;
