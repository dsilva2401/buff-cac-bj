import styled from 'styled-components';

type ImageProps = {
  width?: string;
  maxWidth?: string;
  height?: string;
  padding?: string;
  margin?: string;
  rounded?: boolean;
  objectFit?: string;
  position?: string;
  transition?: string;
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;
  opacity?: string | number;
};

const Image = styled.img<ImageProps>`
  position: ${(props) => (props.position ? props.position : 'relative')};
  top: ${(props) => props.top ? props.top : 'unset'};
  left: ${(props) => props.left ? props.left : 'unset'};
  bottom: ${(props) => props.bottom ? props.bottom : 'unset'};
  right: ${(props) => props.right ? props.right : 'unset'};
  width: ${(props) => (props.width ? props.width : '100%')};
  max-width: ${props => props.maxWidth ? props.maxWidth : '100%;'};
  height: ${(props) => (props.height ? props.height : 'unset')};
  padding: ${(props) => (props.padding ? props.padding : 0)};
  margin: ${(props) => (props.margin ? props.margin : 0)};
  border-radius: ${(props) => (props.rounded ? '12px' : 0)};
  object-fit: ${(props) => (props.objectFit ? props.objectFit : 'unset')};
  transition: ${(props) => (props.transition ? props.transition : '0s')};
  opacity: ${(props) => (props.opacity ? props.opacity : 1)};
`;

export default Image;
