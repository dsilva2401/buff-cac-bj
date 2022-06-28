import styled from 'styled-components';
import { theme } from 'styles/theme';

type ProductCardType = {
  registered: boolean;
};

export const ProductCard = styled.button<ProductCardType>`
  position: relative;
  cursor: pointer;
  justify-self: center;
  width: 100%;
  height: 100%;
  padding-top: 100%;
  img {
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
  }
  &::after {
    content: 'Registered';
    position: absolute;
    display: ${(props) => (props.registered ? 'block' : 'none')};
    bottom: 0;
    left: 0;
    padding: 0.4rem 0.6rem;
    color: #fff;
    font-size: 0.8rem;
    background-color: ${theme.primary};
    border: 1px solid #fff;
    border-radius: 0 20px 0 0;
  }
`;
