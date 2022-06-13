import React, { useState } from 'react';
import { InputPlaceholder, InputWrapper } from './styles';
import { ReactComponent as Upload } from 'assets/icons/svg/upload.svg';
import { ReactComponent as Remove } from 'assets/icons/svg/remove.svg';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Image from 'components/Image';
import placeholder from 'assets/images/png/pdf-icon.png';

type UploadInputProps = {
  selectedFile: File[] | undefined;
  changeFile(files: FileList | null): void;
  multiple?: boolean;
};

const UploadInput: React.FC<UploadInputProps> = ({
  selectedFile,
  changeFile,
  multiple = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const regexPDFExtension = new RegExp('(.*?).(pdf)$');

  return (
    <InputWrapper
      isFocused={isFocused}
      isFileSelected={selectedFile ? true : false}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <input
        type='file'
        name='file'
        id='file'
        multiple={multiple ? true : false}
        onChange={({ target: { files } }) => changeFile(files)}
      />
      <label
        htmlFor='file'
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <Wrapper direction='column'>
          {selectedFile?.map((file, idx) => {
            return (
              <Wrapper justifyContent='flex-start' key={idx} direction='column'>
                <Text fontSize='1rem' margin='0 0 10px 0px'>
                  <span>{file.name}</span>
                </Text>
                <Image
                  height='105px'
                  width='110px !important'
                  src={
                    !regexPDFExtension.test(file.name)
                      ? placeholder
                      : URL.createObjectURL(file)
                  }
                ></Image>
              </Wrapper>
            );
          })}
        </Wrapper>

        {/* {selectedFile ? selectedFile.name : ''} */}
      </label>
      <InputPlaceholder
        isFocused={isFocused}
        isFileSelected={selectedFile ? true : false}
      >
        {selectedFile ? 'file name' : 'Upload File'}
      </InputPlaceholder>

      {selectedFile ? <Remove onClick={() => changeFile(null)} /> : <Upload />}
    </InputWrapper>
  );
};

export default UploadInput;
