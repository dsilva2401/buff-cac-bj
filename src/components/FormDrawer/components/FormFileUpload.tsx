import { FormDetailModel } from 'types/FormTypes';
import { FormikProps } from 'formik';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import { useEffect, useState } from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import { useFormik } from 'formik';
import UploadInput from './FileUpload/UploadInput';
import { showToast } from 'components/Toast/Toast';
import IFileFrom from './FileUpload/UploadInput/model';

type Props = {
  formData: FormDetailModel;
  formRef: FormikProps<any> | null;
  name: string;
};

const FormFileUpload = (props: Props) => {
  const { formData, formRef, name } = props;
  const [selectedFile, setSelectedFile] = useState<IFileFrom[] | undefined>();
  const regexFileExtension = new RegExp('(.*?).(png|jpeg|jpg|pdf|heic)$');
  const [extensionError, setExtensionError] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string>('');

  const changeSelectedFile = async (files: FileList) => {
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        if (!regexFileExtension.test(files[i].name)) {
          setExtensionError(true);
          return false;
        }
      }
    }

    setExtensionError(false);

    if (files && files.length > 0) {
      const fileObject: IFileFrom = { fileName: files[0].name };
      setSelectedFile([fileObject]);
      formikFileUpload.setFieldValue('fileUpload', [fileObject]);
      formRef?.setFieldValue(name, [fileObject]);
      formikFileUpload.validateForm();
      const API_URL =
        process.env.REACT_APP_STAND_ALONE_MODE === 'false'
          ? process.env.REACT_APP_API_URL
          : '';
      const form = new FormData();
      form.append('file', files[0]);
      // this needs to change useAPI so I did it here for now since it's unique
      let res: Response = new Response();
      try {
        res = await fetch(`${API_URL}/app_api/form/sync_files_to_S3`, {
          method: 'POST',
          body: form,
        });
      } catch (e) {
        showToast({
          message: 'File Failed to sync to s3 please upload again.',
          type: 'error',
        });
        setSelectedFile(undefined);
        formikFileUpload.setFieldValue('fileUpload', []);
        formikFileUpload.validateForm();
        formRef?.setFieldValue(name, []);
        formRef?.validateForm();
      }
      const resultsParsed = await res.json();
      setObjectUrl(resultsParsed.url);
      formRef?.validateForm();
    } else {
      setSelectedFile(undefined);
      formikFileUpload.setFieldValue('fileUpload', []);
      formikFileUpload.validateForm();
      formRef?.setFieldValue(name, []);
      formRef?.validateForm();
    }
  };

  useEffect(() => {
    if (objectUrl) {
      // need to store file along with s3 url for form submission
      if (selectedFile) {
        const formFile: IFileFrom = {
          fileName: selectedFile[0].fileName,
          fileUrl: objectUrl,
        };
        formRef?.setFieldValue(name, [formFile]);
        setSelectedFile([formFile]);
        formRef?.validateForm();
      }
    }
  }, [objectUrl]);

  const formikFileUpload = useFormik({
    initialValues: {
      fileUpload: [],
    },
    onSubmit: () => {},
  });

  useEffect(() => {
    if (formRef && formData.isRequired) {
      formRef.validateField(name);
    }

    if (formRef && formRef.values[name] && formRef.values[name].length) {
      if (formRef.values[name][0].fileUrl) {
        formikFileUpload.setFieldValue('fileUpload', formRef.values[name]);
        if (!selectedFile) {
          setSelectedFile(formRef.values[name]);
        }
      }
      formikFileUpload.validateForm();
      formRef.validateField(name);
    }
  }, [formRef?.values[name]]);

  return formRef && formRef.values[name] !== undefined ? (
    <Wrapper justifyContent='flex-start' direction='column' width='100%'>
      <Text
        color='#000000'
        textAlign='left'
        fontSize='1.2rem'
        fontWeight='bold'
      >
        <span>{formData.text}</span>
      </Text>
      <Text color='#98A3AA' textAlign='left' fontSize='0.8rem'>
        <span>{formData.subText}</span>
      </Text>
      <Wrapper
        margin='12px 0 0'
        alignItems='center'
        justifyContent='flex-start'
        direction='column'
      >
        <UploadInput
          multiple={false}
          changeFile={changeSelectedFile}
          selectedFile={selectedFile}
        />
        {extensionError && (
          <Wrapper justifyContent='flex-start'>
            <Text color='red' padding='10px'>
              <span>
                File extenstion not supported. valid files are .pdf, .jpeg,
                .jpg, heic and .png
              </span>
            </Text>
          </Wrapper>
        )}
      </Wrapper>
    </Wrapper>
  ) : (
    <LoadingIndicator />
  );
};

export default FormFileUpload;
