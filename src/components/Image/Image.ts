import styled from "styled-components";

type ImageProps = {
  width?: string;
  maxWidth?: string;
  height?: string;
  padding?: string;
  margin?: string;
  rounded?: boolean;
};

const Image = styled.img<ImageProps>`
  position: relative;
  width: ${(props) => (props.width ? props.width : "100%")};
  max-width: ${props => props.maxWidth ? props.maxWidth : "100%;"};
  height: ${(props) => (props.height ? props.height : "unset")};
  padding: ${(props) => (props.padding ? props.padding : 0)};
  margin: ${(props) => (props.margin ? props.margin : 0)};
  border-radius: ${(props) => (props.rounded ? "12px" : 0)};
`;

export default Image;
