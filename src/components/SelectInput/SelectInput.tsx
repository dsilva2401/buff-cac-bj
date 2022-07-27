import React, { useState } from 'react';
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
  removeFilter?: (value: string) => void;
  optionItem?: string;
};

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  options,
  label,
  name = '',
  placeholder = '',
  onChange,
  selected,
  removeFilter,
  optionItem,
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  return (
    <SelectWrapper fullWidth>
      <Label id={id}>{label}</Label>
      <Select
        name={name}
        open={opened}
        placeholder={placeholder}
        labelId={selected ?? options[0]}
        value={selected}
        defaultValue={options[0]}
        onChange={({ target: { value } }) => {
          onChange(String(value));
        }}
        onOpen={() => {
          setOpened(true);
          if (selected && optionItem && removeFilter) {
            removeFilter(optionItem);
          }
        }}
        onClose={() => setOpened(false)}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          classes: { list: 'not-draggable' },
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
