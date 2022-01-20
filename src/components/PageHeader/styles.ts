import styled from 'styled-components';

type HeaderProps = {
  border?: boolean;
  transparent?: boolean;
};

const Header = styled.header<HeaderProps>`
  width: 100%;
  padding: 2rem 1.2rem;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.transparent ? 'transparent' : '#FFFFFF'};
  border-bottom: ${(props) => (props.border ? '1px solid #e7eaeb' : 'none')};

  h1 {
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }
`;

export default Header;
