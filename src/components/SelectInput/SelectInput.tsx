import React from 'react';
import { Label, Option, Select, SelectWrapper } from './styles';

type SelectInputProps = {
  id: string;
  options: string[];
  label: string;
  isSuccess: boolean;
  selected?: string;
  onChange: (value: string) => void;
};

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  options,
  label,
  isSuccess,
  onChange,
  selected,
}) => {
  return (
    <SelectWrapper fullWidth>
      <Label id={id}>{label}</Label>
      <Select
        labelId={selected ?? options[0]}
        value={selected ?? options[0]}
        onChange={({ target: { value } }) => {
          onChange(String(value));
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          getContentAnchorEl: null,
        }}
      >
        {options.map((option) => {
          return <Option value={option}>{option}</Option>;
        })}
      </Select>
    </SelectWrapper>
  );
};
export default SelectInput;
