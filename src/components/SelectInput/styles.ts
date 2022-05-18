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
    font-size: 1rem;
    background: transparent;
  }
  &.MuiInputLabel-shrink {
    transform: translate(1.8rem, 0.625rem) scale(0.75);
    transform-origin: top left;
    padding: 0 4px;
    background-color: #ffffff;
  }
`;

export const SelectWrapper = styled(FormControl)`
  .MuiFormLabel-root.Mui-focused {
    color: #1b1b1b;
    background-color: #ffffff;
  }
`;

export const Select = styled(SelectMaterial)`
  width: 100%;
  position: relative;
  z-index: 1;
  background-color: #ffffff;
  &::after {
    display: none;
  }
  &::before {
    display: none;
  }
  .MuiSelect-select {
    width: 100%;
    background-color: #ffffff;
    border: 3px solid #f4f4f4;
    padding: 1.2rem 2rem;
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
