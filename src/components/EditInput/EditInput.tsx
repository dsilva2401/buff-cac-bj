import React, { useEffect, useState } from 'react';
import { InputWrapper, InputPlaceholder } from './styles';

type EditInputProps = {
  className?: string;
  placeholder: string;
  value: string | undefined;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  width?: number;
  type?: string;
};

const SearchInput: React.FC<EditInputProps> = ({
  className = '',
  value,
  placeholder,
  onChange,
  width,
  onBlur = (value) => {},
  type = 'text',
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
        className={className}
        type={type}
        width='100%'
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          !value && setIsFocused(false);
          if (value !== undefined) {
            onBlur(value);
          }
        }}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </InputWrapper>
  );
};

export default SearchInput;
