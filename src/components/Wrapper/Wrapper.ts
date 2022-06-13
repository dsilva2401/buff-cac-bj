import styled from 'styled-components';

type PseudoElement = {
  content: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  padding?: string;
  color?: string;
  fontSize?: string;
  border?: string;
  borderRadius?: string;
  background?: string;
};

type WrapperProps = {
  width?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  margin?: string;
  padding?: string;
  position?: string;
  zIndex?: number;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  gap?: string;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexFlow?: string;
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
  alignSelf?: 'center' | 'flex-start' | 'self-start' | 'flex-end' | 'self-end';
  alignContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  cursor?: string;
  overflow?: string;
  border?: string;
  borderRadius?: string;
  background?: string;
  before?: PseudoElement;
  after?: PseudoElement;
  responsiveImg?: boolean;
  transition?: string;
  isPreviewMode?: boolean;
};

const Wrapper = styled.div<WrapperProps>`
  width: ${(props) => (props.width ? props.width : 'auto')};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : 'unset')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'unset')};
  margin: ${(props) => (props.margin ? props.margin : 'unset')};
  padding: ${(props) => (props.padding ? props.padding : 'unset')};
  position: ${(props) => (props.position ? props.position : 'inherit')};
  z-index: ${(props) => (props.zIndex ? props.zIndex : 'unset')};
  top: ${(props) => (props.top ? props.top : 'unset')};
  left: ${(props) => (props.left ? props.left : 'unset')};
  bottom: ${(props) => (props.bottom ? props.bottom : 'unset')};
  right: ${(props) => (props.right ? props.right : 'unset')};
  display: flex;
  gap: ${(props) => (props.gap ? props.gap : 'unset')};
  flex-direction: ${(props) => (props.direction ? props.direction : 'row')};
  flex-flow: ${(props) => (props.flexFlow ? props.flexFlow : '')};
  justify-content: ${(props) =>
    props.justifyContent ? props.justifyContent : 'unset'};
  align-items: ${(props) => (props.alignItems ? props.alignItems : 'unset')};
  align-self: ${(props) => (props.alignSelf ? props.alignSelf : 'unset')};
  align-content: ${(props) =>
    props.alignContent ? props.alignContent : 'unset'};
  cursor: ${(props) => (props.cursor ? props.cursor : 'unset')};
  overflow: ${(props) => (props.overflow ? props.overflow : 'unset')};
  background: ${(props) => (props.background ? props.background : 'unset')};
  border: ${(props) => (props.border ? props.border : 'unset')};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : 'unset'};
  transition: ${(props) => (props.transition ? props.transition : 'unset')};

  &::before {
    content: ${(props) =>
      props.before?.content ? `'${props.before.content}'` : 'none'};
    width: ${(props) => (props.before?.width ? props.before.width : 'auto')};
    height: ${(props) => (props.before?.height ? props.before.height : 'auto')};
    position: ${(props) =>
      props.before?.position ? props.before.position : 'inherit'};
    top: ${(props) => (props.before?.top ? props.before.top : 'unset')};
    left: ${(props) => (props.before?.left ? props.before.left : 'unset')};
    right: ${(props) => (props.before?.right ? props.before.right : 'unset')};
    bottom: ${(props) =>
      props.before?.bottom ? props.before?.bottom : 'unset'};
    padding: ${(props) =>
      props.before?.padding ? props.before.padding : 'unset'};
    color: ${(props) => (props.before?.color ? props.before.color : 'unset')};
    font-size: ${(props) =>
      props.before?.fontSize ? props.before.fontSize : 'inherit'};
    border: ${(props) => (props.before?.border ? props.before.border : 'none')};
    border-radius: ${(props) =>
      props.before?.borderRadius ? props.before.borderRadius : 'unset'};
    background: ${(props) =>
      props.before?.background ? props.before.background : 'unset'};
  }

  &::after {
    content: ${(props) =>
      props.after?.content ? `'${props.after.content}'` : 'none'};
    width: ${(props) => (props.after?.width ? props.after.width : 'auto')};
    height: ${(props) => (props.after?.height ? props.after.height : 'auto')};
    position: ${(props) =>
      props.after?.position ? props.after.position : 'inherit'};
    top: ${(props) => (props.after?.top ? props.after.top : 'unset')};
    left: ${(props) => (props.after?.left ? props.after.left : 'unset')};
    right: ${(props) => (props.after?.right ? props.after.right : 'unset')};
    bottom: ${(props) => (props.after?.bottom ? props.after?.bottom : 'unset')};
    padding: ${(props) =>
      props.after?.padding ? props.after.padding : 'unset'};
    color: ${(props) => (props.after?.color ? props.after.color : 'unset')};
    font-size: ${(props) =>
      props.after?.fontSize ? props.after.fontSize : 'inherit'};
    border: ${(props) => (props.after?.border ? props.after.border : 'none')};
    border-radius: ${(props) =>
      props.after?.borderRadius ? props.after.borderRadius : 'unset'};
    background: ${(props) =>
      props.after?.background ? props.after.background : 'unset'};
  }

  img {
    width: ${(props) => (props.responsiveImg ? '100%' : 'auto')};
  }
`;

export default Wrapper;
