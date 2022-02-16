import React from 'react';
import styled from 'styled-components';

type FloatingLabelInputProps = {
  value: string,
  placeholder: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
};

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>((props, ref) => (
  <Container>
    <Input
      ref={ref}
      type='text'
      value={props.value}
      placeholder=''
      onChange={props.onChange}
    />
    <Label>{props.placeholder}</Label>
  </Container>
));


export default FloatingLabelInput;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
`;

const Label = styled.label`
  color: #98A3AA;
  order: 1;
  position: absolute;
  pointer-events: none;
  text-shadow: none;
  transform-origin: left top;
  transform: translate3d(24px, 13px, 0);
  transition: 200ms ease all;
`;

const Input = styled.input`
  border: 1px solid transparent;
  border-radius: 26px;
  padding: 0 24px;
  height: 52px;
  color: #000;
  order: 2;
  width: 100%;
  background: #F4F4F4;
  &:focus {
    outline: 0;
    background: #FFFFFF;
    border: 1px solid #98A3AA;
  }
  &:not(:focus) {
    color: transparent;
  }
  &:focus + ${Label} {
    color: #98A3AA;
    opacity: 1;
    background: #FFFFFF;
    border-radius: 20px;
    padding: 1px 6px;
    transform: scale(0.7) translate3d(30px, -12px, 0);
  }
`;
