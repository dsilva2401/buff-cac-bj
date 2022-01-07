import styled from 'styled-components';
import { theme } from 'styles/theme';

type ProductCardType = {
  registered: boolean;
};

export const ProductCard = styled.button<ProductCardType>`
  width: calc(50vw - 28px);
  height: calc(50vw - 28px);
  position: relative;
  cursor: pointer;
  justify-self: center;
  img {
    width: 100%;
    height: 100%;
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
  @media (min-width: 1024px) {
    max-width: 160px;
    height: 160px;
  }
`;
