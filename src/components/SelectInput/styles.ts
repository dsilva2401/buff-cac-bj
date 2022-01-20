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
  }
  &.MuiInputLabel-shrink {
    transform: translate(1.8rem, 0.625rem) scale(0.75);
    transform-origin: top left;
  }
`;

export const SelectWrapper = styled(FormControl)`
  .MuiFormLabel-root.Mui-focused {
    color: #1b1b1b;
  }
`;

export const Select = styled(SelectMaterial)`
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
    background-color: #f4f4f4;
    padding: 1.2rem 2rem;
    border-radius: 30px;
    &:focus {
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
