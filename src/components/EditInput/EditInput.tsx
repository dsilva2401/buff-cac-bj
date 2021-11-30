import React, { useEffect, useState } from "react";

import { InputWrapper, InputPlaceholder } from "./styles";

type EditInputProps = {
  value: string | undefined;
  placeholder: string;
  onChange: (value: string) => void;
};

const SearchInput: React.FC<EditInputProps> = ({
  value,
  placeholder,
  onChange,
}: EditInputProps) => {
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    if (value) {
      setIsFocused(true);
    } else {
      setIsFocused(false);
    }
  }, [value]);

  return (
    <InputWrapper isFocused={isFocused}>
      <InputPlaceholder isFocused={isFocused}>{placeholder}</InputPlaceholder>
      <input
        type="text"
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => !value && setIsFocused(false)}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </InputWrapper>
  );
};

export default SearchInput;
