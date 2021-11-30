import React, { useEffect, useState } from "react";
import { Select, Option, Label, SelectWrapper } from "./styles";

type SelectInputProps = {
  id: string;
  options: string[];
  label: string;
  isSuccess: boolean;
  onChange: (value: string | number) => void;
};

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  options,
  label,
  isSuccess,
  onChange,
}) => {
  const [currentSelected, setCurrentSelected] = useState<string | number>("");

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setCurrentSelected("");
      }, 1000);
    }
  }, [isSuccess]);

  return (
    <SelectWrapper fullWidth>
      <Label id={id}>{label}</Label>
      <Select
        labelId="id"
        value={currentSelected}
        onChange={({ target: { value } }) => {
          setCurrentSelected(value as string | number);
          onChange(value as string | number);
          }
        }
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
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
