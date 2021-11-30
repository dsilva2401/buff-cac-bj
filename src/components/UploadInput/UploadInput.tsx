import React, { useState } from "react";
import { ReactComponent as Upload } from "assets/icons/svg/upload.svg";
import { ReactComponent as Remove } from "assets/icons/svg/remove.svg";
import { InputPlaceholder, InputWrapper } from "./styles";

type UploadInputProps = {
  selectedFile: File | undefined;
  changeFile(files: FileList | null): void;
};

const UploadInput: React.FC<UploadInputProps> = ({
  selectedFile,
  changeFile,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputWrapper
      isFocused={isFocused}
      isFileSelected={selectedFile ? true : false}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <input
        type="file"
        name="file"
        id="file"
        onChange={({ target: { files } }) => changeFile(files)}
      />
      <label
        htmlFor="file"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        {selectedFile ? selectedFile.name : ""}
      </label>
      <InputPlaceholder
        isFocused={isFocused}
        isFileSelected={selectedFile ? true : false}
      >
        {selectedFile ? "Dated Receipt" : "Upload dated receipt..."}
      </InputPlaceholder>

      {selectedFile ? <Remove onClick={() => changeFile(null)} /> : <Upload />}
    </InputWrapper>
  );
};

export default UploadInput;
