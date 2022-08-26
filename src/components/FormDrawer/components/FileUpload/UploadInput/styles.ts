import styled from 'styled-components';

type UploadInputProps = {
  isFocused: boolean;
  isFileSelected: boolean;
};

export const InputWrapper = styled.div<UploadInputProps>`
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.isFileSelected || props.isFocused ? 'transparent' : '#fff'};
  border: ${(props) =>
    props.isFileSelected || props.isFocused
      ? '2px solid #E7EAEB '
      : '1px solid #E7EAEB'};
  height: ${(props) => (props.isFileSelected ? '180px' : 'auto')};
  border-radius: 30px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.isFileSelected ? 'none' : '0px 1px 4px rgba(0, 0, 0, 0.16)'};
  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  label {
    cursor: pointer;
    width: 100%;
    height: 3rem;
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    color: #000;
    background: transparent;
    z-index: 2;
  }
  .remove-icon {
    font-size: 20px;
    position: absolute;
    top: 15px;
    right: 20px;
  }
  .file-name {
    position: absolute;
    top: 10px;
  }
  svg {
    margin-right: 8px;
    right: 1rem;
    color: #202029;
    z-index: ${(props) => (props.isFileSelected ? 3 : 1)};
    path {
      fill: #000;
    }
  }
`;

export const InputPlaceholder = styled.span<UploadInputProps>`
  position: absolute;
  font-weight: ${(props) => (props.isFileSelected ? '400' : '600')};
  padding: 0
    ${(props) => (props.isFileSelected || props.isFocused ? '0.6rem' : '0')};
  color: ${(props) =>
    props.isFileSelected || props.isFocused ? '#98A3AA' : '#202029'};
  transition: all 0.3s ease;
  z-index: 1;
  top: ${(props) => (props.isFileSelected ? '20px' : 'auto')};
  font-size: ${(props) =>
    props.isFocused || props.isFileSelected ? '0.85rem' : '0.9rem'};
  background-color: ${(props) =>
    props.isFocused || props.isFileSelected ? '#fff' : 'transparent'};
  top: ${(props) => (props.isFileSelected ? '-12px ' : 'unset')};
  left: ${(props) => (props.isFileSelected ? '10px' : 'unset')};
  transform: ${(props) => (props.isFileSelected ? 'scale(0.8)' : 'unset')};
  .upload-file {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
