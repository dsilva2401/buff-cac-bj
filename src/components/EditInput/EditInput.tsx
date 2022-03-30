import React, { useEffect, useState } from 'react';
import { InputWrapper, InputPlaceholder } from './styles';

type EditInputProps = {
  placeholder: string;
  value: string | undefined;
  onChange: (value: string) => void;
  width?: number;
};

const SearchInput: React.FC<EditInputProps> = ({
  value,
  placeholder,
  onChange,
  width,
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
    <InputWrapper isFocused={isFocused} width={`${width}px`}>
      <InputPlaceholder isFocused={isFocused}>{placeholder}</InputPlaceholder>
      <input
        type='text'
        width='100%'
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => !value && setIsFocused(false)}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </InputWrapper>
  );
};

export default SearchInput;
