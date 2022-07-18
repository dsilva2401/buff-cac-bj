import React, { ChangeEvent, useEffect, useState } from 'react';
import { InputWrapper } from './styles';

type EditTextAreaProps = {
  placeholder: string;
  value: string | undefined;
  name: string;
  onChange: (value: string, e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (value: string) => void;
  onFocus?: () => void;
  width?: number;
  rows?: number;
};

const SearchInput: React.FC<EditTextAreaProps> = ({
  value,
  placeholder,
  onChange,
  width,
  name,
  onBlur = (value) => {},
  onFocus = () => {},
  rows = 2,
}: EditTextAreaProps) => {
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
      <textarea
        rows={rows}
        name={name}
        value={value}
        placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true);
          onFocus();
        }}
        onBlur={() => {
          !value && setIsFocused(false);
          if (value !== undefined) {
            onBlur(value);
          }
        }}
        onChange={(e) => onChange(e.target.value, e)}
      />
    </InputWrapper>
  );
};

export default SearchInput;
