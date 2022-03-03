import React from 'react';
import Text from 'components/Text';
import { theme } from 'styles/theme';
import { useGlobal } from 'context/global/GlobalContext';
import { ReactComponent as TableCheckmark } from 'assets/icons/svg/table-checkmark.svg';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  NullIcon,
} from './styles';

type TableProps = {
  headers: string[];
  tableData: string[];
};

const DataTable: React.FC<TableProps> = ({ headers, tableData }) => {
  const { appTheme } = useGlobal();

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell
              key={header}
              theme={appTheme || theme.primary}
              edgecaseTop={header === 'mulberry'}
              style={
                header !== 'mulberry'
                  ? {
                      boxShadow: `0px 1px 0px 0px ${appTheme || theme.primary}`,
                    }
                  : {}
              }
            >
              <Text
                color={
                  header === 'mulberry' ? appTheme || theme.primary : 'black'
                }
                fontSize={index === 0 ? '1rem' : '0.75rem'}
                textAlign={index === 0 ? 'left' : 'center'}
                padding={index === 0 ? '0' : '0 0.5rem'}
                fontWeight={index === 0 ? '600' : '400'}
              >
                <p>{header}</p>
              </Text>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableData.map((title: string, index: number) => (
          <TableRow>
            <TableCell
              width='60%'
              key={title}
              theme={appTheme || theme.primary}
              padding='0.5rem 1rem 0.5rem 0rem'
              lastRow={index === tableData.length - 1}
            >
              <Text fontSize='0.75rem'>
                <p>{title}</p>
              </Text>
            </TableCell>
            <TableCell
              featured
              theme={appTheme || theme.primary}
              lastRow={index === tableData.length - 1}
              edgecaseBottom={index === tableData.length - 1}
            >
              <TableCheckmark fill={appTheme || theme.primary} />
            </TableCell>
            <TableCell
              lastRow={index === tableData.length - 1}
              theme={appTheme || theme.primary}
            >
              {index === 0 ? (
                <TableCheckmark fill={appTheme || theme.primary} />
              ) : (
                <NullIcon />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
