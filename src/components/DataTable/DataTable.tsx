import React from 'react';
import Text from 'components/Text';
import { theme } from 'styles/theme';
import { ReactComponent as TableCheckmark } from 'assets/icons/svg/table-checkmark.svg';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  NullIcon
} from './styles';

type TableProps = {
  headers: string[];
  tableData: TableRowData[];
};

type TableRowData = {
  title: string;
  mulberry: boolean;
  manufacturerWarranty: boolean;
};

const DataTable: React.FC<TableProps> = ({ headers, tableData }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header, index) =>
            <TableCell
              key={header}
              edgecaseTop={header === 'mulberry'}
              style={header !== 'mulberry' ? { boxShadow: `0px 1px 0px 0px ${theme.primary}` } : { }}
            >
              <Text
                color={header === 'mulberry' ? theme.primary : 'black'}
                fontSize={index === 0 ? '1rem' : '0.75rem'}
                textAlign={index === 0 ? 'left' : 'center'}
                padding={index === 0 ? '0' : '0 0.5rem'}
                fontWeight={index === 0 ? '600' : '400'}
              >
                <p>{header}</p>
              </Text>
            </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.map((tableRow: TableRowData, index: number) => (
          <TableRow>
            <TableCell
              width='60%'
              key={tableRow.title}
              padding='0.5rem 1rem 0.5rem 0rem'
              lastRow={index === tableData.length - 1}
            >
              <Text fontSize='0.75rem'>
                <p>{tableRow.title}</p>
              </Text>
            </TableCell>
            <TableCell
              featured
              lastRow={index === tableData.length - 1}
              edgecaseBottom={index === tableData.length - 1}
            >
              {tableRow.mulberry ? <TableCheckmark /> : <NullIcon />}
            </TableCell>
            <TableCell lastRow={index === tableData.length - 1}>
              {tableRow.manufacturerWarranty ? <TableCheckmark /> : <NullIcon />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
