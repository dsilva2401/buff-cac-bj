import React, { useState } from 'react';
import { InputPlaceholder, InputWrapper } from './styles';
import { ReactComponent as Upload } from 'assets/icons/svg/upload.svg';
import { ReactComponent as Remove } from 'assets/icons/svg/remove.svg';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import Image from 'components/Image';
import placeholder from 'assets/images/png/pdf-placeholder.png';
import IFileForm from './model';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import LoadingIndicator from 'components/LoadingIndicator';

type UploadInputProps = {
  selectedFile: IFileForm[] | undefined;
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
  const { fileUploading } = useFormContext();

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
        accept='image/png, image/jpeg, image/jpg, .pdf, .heic'
        multiple={multiple ? true : false}
        onChange={(event) => {
          changeFile(event.target.files);
          event.target.value = '';
        }}
      />
      <label
        htmlFor='file'
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {!fileUploading &&
          selectedFile?.map((file, idx) => {
            return (
              <Wrapper key={idx}>
                <Text
                  textOverflow='ellipsis'
                  whiteSpace='nowrap'
                  overflow='hidden'
                  wrapperWidth='calc(100% - 80px)'
                  className='file-name'
                  fontSize='1rem'
                  fontWeight='400'
                >
                  <span>{file.fileName}</span>
                </Text>
                <Wrapper
                  justifyContent='flex-start'
                  key={idx}
                  direction='column'
                >
                  {file.fileUrl && (
                    <Image
                      height='105px'
                      width='110px !important'
                      src={
                        regexPDFExtension.test(file.fileName)
                          ? placeholder
                          : file.fileUrl
                      }
                    ></Image>
                  )}
                </Wrapper>
              </Wrapper>
            );
          })}
        {fileUploading && (
          <Wrapper width='100%' justifyContent='center' alignContent='center'>
            <LoadingIndicator />
          </Wrapper>
        )}
      </label>
      <InputPlaceholder
        isFocused={isFocused}
        isFileSelected={selectedFile ? true : false}
      >
        {selectedFile ? (
          'File Name'
        ) : (
          <span className='upload-file'>
            <Upload />
            <Text fontSize='1rem' fontWeight='600' color='#202029'>
              <span>Upload File</span>
            </Text>
          </span>
        )}
      </InputPlaceholder>

      {selectedFile ? (
        <Remove className='remove-icon' onClick={() => changeFile(null)} />
      ) : (
        ''
      )}
    </InputWrapper>
  );
};

export default UploadInput;
