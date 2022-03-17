import React from 'react';
import styled from 'styled-components';
import FloatingLabel from 'react-styled-floating-label';

type FloatingLabelInputProps = {
  width: number;
  value: string;
  placeholder: string;
  autoFocus: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  value,
  placeholder,
  autoFocus,
  onChange,
  width,
}) => {
  return (
    <FloatingLabelWrapper
      focused={value !== ''}
      placeholderStyle={{ background: '#f4f4f4' }}
      text={placeholder}
    >
      <Input
        type='text'
        width={width}
        value={value}
        autoFocus={autoFocus}
        key={value || 'email-input'}
        onChange={onChange}
      />
    </FloatingLabelWrapper>
  );
};

export default FloatingLabelInput;

const FloatingLabelWrapper = styled<any>(FloatingLabel)`
  color: #98a3aa;
  position: absolute;
  font-size: 14px;
  left: 24px;
  top: 14px;
  pointer-events: none;
  transform-origin: left top;
  transform: translate3d(-2px, -24px, 0) scale(0.72);
  transition: 0.3s;
  background: #ffffff;
  padding: 2px 4px;
`;

const Input = styled.input`
  border-radius: 26px;
  padding: 0 24px;
  height: 52px;
  color: #000;
  position: relative;
  width: ${(props) => `${props.width}px` || '100%'};
  border: ${(props) =>
    props.value === '' ? '1px solid transparent' : '1px solid #98a3aa'};
  background: ${(props) => (props.value === '' ? '#f4f4f4' : '#ffffff')};
  &:focus {
    outline: 0;
    background: #ffffff;
    border: 1px solid #98a3aa;
  }
`;
