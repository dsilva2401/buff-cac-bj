import styled from 'styled-components';
import {
  MenuItem,
  InputLabel,
  FormControl,
  Select as SelectMaterial,
} from '@material-ui/core';

export const Label = styled(InputLabel)`
  color: #98a3aa;
  z-index: 2;
  &.MuiInputLabel-formControl {
    top: 0;
    left: 0;
    position: absolute;
    transform: translate(1.875rem, 2.375rem) scale(1);
    font-family: 'Poppins', sans-serif;
    font-size: 0.875rem;
    background: transparent;
    padding: 0;
  }
  &.MuiInputLabel-shrink {
    transform: translate(1.875rem, 2.375rem) scale(0);
    transform-origin: top left;
    background-color: #ffffff;
    padding: 0 4px;
  }
`;

export const FormSelectWrapper = styled(FormControl)`
  .MuiFormLabel-root.Mui-focused {
    color: #1b1b1b;
    background-color: #ffffff;
  }
`;

export const FormSelect = styled(SelectMaterial)`
  width: 100%;
  position: relative;
  z-index: 1;
  &::after {
    display: none;
  }
  &::before {
    display: none;
  }
  .MuiSelect-select {
    width: 100%;
    background: #fff;
    background: ${(props) =>
      props.open || props.value ? '#ffffff' : '#f4f4f4'};
    border: ${(props) =>
      props.open || props.value ? '3px solid #E7EAEB' : '3px solid #f4f4f4'};
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    height: 52px;
    font-size: 0.875rem;
    border-radius: 30px;
    &:focus {
      background: #ffffff;
      border-radius: 30px;
    }
  }
  .MuiSelect-nativeInput {
    display: none;
  }
  .MuiSelect-icon {
    right: 1.5rem;
  }
`;

export const Option = styled(MenuItem)``;
