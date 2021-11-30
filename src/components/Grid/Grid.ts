import styled from "styled-components";

type GridProps = {
  width?: string;
  margin?: string;
  padding?: string;
  rowGap?: string;
  columnGap?: string;
  templateColumns?: string;
  templateRows?: string;
};

const Grid = styled.div<GridProps>`
  display: grid;
  width: ${(props) => (props.width ? props.width : "100%")};
  margin: ${(props) => (props.margin ? props.margin : "unset")};
  padding: ${(props) => (props.padding ? props.padding : "unset")};
  grid-auto-flow: row;
  grid-column-gap: ${(props) => (props.columnGap ? props.columnGap : "1rem")};
  grid-template-columns: ${(props) =>
    props.templateColumns
      ? props.templateColumns
      : "repeat(auto-fit, minmax(auto, 1fr))"};
  grid-template-rows: ${(props) =>
    props.templateRows
      ? props.templateRows
      : "repeat(auto-fit, minmax(auto, 1fr))"};
  grid-row-gap: ${(props) => (props.rowGap ? props.rowGap : "1rem")};
  grid-template-rows: 1fr;
`;

export default Grid;
