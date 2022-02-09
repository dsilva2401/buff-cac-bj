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
  border-bottom: ${(props) => (props.lastRow ? '0' : '1px solid #E7EAEB')};
  text-align: center;
  ${({ featured }) => {
    if(featured) {
      return `border-right: 1px solid ${theme.primary}; border-left: 1px solid ${theme.primary};`;
    }
  }}
  ${({ edgecaseTop }) => {
    if(edgecaseTop) {
      return `border-top: 1px solid ${theme.primary};`;
    }
  }}
  ${({ edgecaseBottom }) => {
    if(edgecaseBottom) {
      return `border-bottom: 1px solid ${theme.primary};`;
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
