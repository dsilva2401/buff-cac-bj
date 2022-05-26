import React from 'react';
import { Label, Option, Select, SelectWrapper } from './styles';

type SelectInputProps = {
  id: string;
  options: string[];
  label: string;
  name?: string;
  noInitValue?: boolean;
  placeholder?: string;
  selected?: string;
  onChange: (value: string) => void;
};

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  options,
  label,
  name = '',
  placeholder = '',
  noInitValue = false,
  onChange,
  selected,
}) => {
  return (
    <SelectWrapper fullWidth>
      <Label id={id}>{label}</Label>
      <Select
        name={name}
        placeholder={placeholder}
        labelId={selected ?? options[0]}
        value={
          selected !== null || selected !== undefined ? selected : options[0]
        }
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
        {options.map((option, idx) => {
          return (
            <Option key={idx} value={option}>
              {option}
            </Option>
          );
        })}
      </Select>
    </SelectWrapper>
  );
};
export default SelectInput;
