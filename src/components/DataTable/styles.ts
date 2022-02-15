import styled from 'styled-components';
import { theme } from 'styles/theme';

type TableCellProps = {
  padding?: string;
  lastRow?: boolean;
  featured?: boolean;
  edgecaseTop?: boolean;
  edgecaseBottom?: boolean;
};

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead``;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr``;

export const TableCell = styled.td<TableCellProps>`
  padding: ${(props) => (props.padding ? props.padding : '0.5rem 0')};
  box-shadow: 0px 1px 0px 0px #E7EAEB;
  text-align: center;
  ${({ featured, lastRow }) => {
    if(featured && !lastRow) {
      return `box-shadow: 0px 1px 0px #E7EAEB, -1px 0px 0px 0px ${theme.primary}, 1px 0px 0px 0px ${theme.primary};`;
    }
  }}
  ${({ edgecaseTop }) => {
    if(edgecaseTop) {
      return `border-top-left-radius: 5px; border-top-right-radius: 5px; box-shadow: 0px 0px 0px 1px ${theme.primary};`;
    }
  }}
  ${({ edgecaseBottom }) => {
    if(edgecaseBottom) {
      return `border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; box-shadow: 0px 1px 0px ${theme.primary}, -1px 1px 1px ${theme.primary}, 1px 1px 0px ${theme.primary};`;
    }
  }}
`;

export const NullIcon = styled.div`
  width: 9px;
  height: 2px;
  margin: auto;
  background: #CBD1D4;
  border-radius: 1rem;
`;
