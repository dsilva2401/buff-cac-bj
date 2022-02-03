import styled from 'styled-components';

type TextProps = {
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textTransform?: string;
  textAlign?: string;
  listStyle?: string;
  color?: string;
  padding?: string;
  margin?: string;
  height?: string
  cursor?: string;
};

const Text = styled.div<TextProps>`
  & {
    height: ${(props) => (props.height ? props.height : 'auto')}
  };
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  a,
  li,
  span {
    font-size: ${(props) => (props.fontSize ? props.fontSize : 'inherit')};
    font-weight: ${(props) =>
    props.fontWeight ? props.fontWeight : 'inherit'};
    font-style: ${(props) => (props.fontStyle ? props.fontStyle : 'inherit')};
    text-decoration: ${(props) =>
    props.textDecoration ? props.textDecoration : 'inherit'};
    text-transform: ${(props) =>
    props.textTransform ? props.textTransform : 'unset'};
    text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
    list-style: ${(props) => (props.listStyle ? props.listStyle : 'none')};
    color: ${(props) => (props.color ? props.color : 'inherit')};
    padding: ${(props) => (props.padding ? props.padding : 'unset')};
    margin: ${(props) => (props.margin ? props.margin : 'unset')};
    cursor: ${(props) => (props.cursor ? props.cursor : 'unset')};
  }
`;

export default Text;
