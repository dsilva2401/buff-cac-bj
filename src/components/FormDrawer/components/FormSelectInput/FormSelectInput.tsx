import React, { useState } from 'react';
import { Label, Option, FormSelect, FormSelectWrapper } from './styles';

type FormSelectInputProps = {
  id: string;
  options: string[];
  label: string;
  name?: string;
  noInitValue?: boolean;
  placeholder?: string;
  selected?: string;
  onChange: (value: string) => void;
};

const FormSelectInput: React.FC<FormSelectInputProps> = ({
  id,
  options,
  label,
  name = '',
  placeholder = '',
  onChange,
  selected,
}) => {
  const [opened, setOpened] = useState(false);

  return (
    <FormSelectWrapper fullWidth>
      <Label id={id}>{label}</Label>
      <FormSelect
        name={name}
        open={opened}
        placeholder={placeholder}
        labelId={selected ?? options[0]}
        value={selected}
        defaultValue={options[0]}
        onChange={({ target: { value } }) => {
          onChange(String(value));
        }}
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
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
      </FormSelect>
    </FormSelectWrapper>
  );
};
export default FormSelectInput;
