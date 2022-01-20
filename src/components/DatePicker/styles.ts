import styled from 'styled-components';

type PickerProps = {
  isDateSelected: boolean;
  isFocused: boolean;
};

export const InputWrapper = styled.div<PickerProps>`
  width: 100%;
  background-color: ${(props) =>
    props.isDateSelected || props.isFocused ? 'transparent' : '#f4f4f4'};
  border: 1px solid
    ${(props) =>
    props.isDateSelected || props.isFocused ? '#1b1b1b' : 'transparent'};
  color: ${(props) =>
    props.isDateSelected || props.isFocused ? '#000' : 'transparent'};
  border-radius: 30px;
  padding: 0.7rem 1.4rem;
  display: flex;
  align-items: center;
  position: relative;

  svg {
    position: absolute;
    right: 1.1rem;
    z-index: 1;
    opacity: ${(props) => (props.isDateSelected || props.isFocused ? 1 : 0.3)};
    transition: opacity 0.3s ease;

    path {
      fill: #000;
    }
  }
`;

export const NativePicker = styled.input<PickerProps>`
  width: 100%;
  height: 30px;
  border: none;
  position: relative;
  z-index: 2;

  &[type='date'] {
    font-family: 'Poppins', sans-serif;
    background: transparent url(${''}) 97% 50% no-repeat;
    color: ${(props) =>
    props.isDateSelected || props.isFocused ? '#000' : 'transparent'};
    &::-webkit-inner-spin-button {
      display: none;
    }
    &::-webkit-calendar-picker-indicator {
      opacity: 0;
    }
  }
`;

export const InputPlaceholder = styled.span<PickerProps>`
  position: absolute;
  padding: 0
    ${(props) => (props.isDateSelected || props.isFocused ? '0.6rem' : '0')};
  color: ${(props) =>
    props.isDateSelected || props.isFocused ? '#000' : 'rgba(0, 0, 0, 0.54)'};
  transition: all 0.3s ease;
  z-index: 1;
  font-size: ${(props) =>
    props.isFocused || props.isDateSelected ? "0.85rem" : "0.9rem"};
  background-color: ${(props) =>
    props.isFocused || props.isDateSelected ? "#fff" : "transparent"};
  transform: ${(props) =>
    props.isFocused || props.isDateSelected
      ? "scale(0.8) translate(-25px, -35px)"
      : "translate(5px, 0)"};
`;
