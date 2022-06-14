import RadioButtons from 'components/RadioButtons';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import { useRouteMatch } from 'react-router-dom';
import { FormDetailModel } from 'types/FormTypes';
import { FormikProps } from 'formik';
import { FormMatchParams } from '../FormDrawer';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import { useEffect, useState } from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import UploadInput from './FileUpload/UploadInput';

type Props = {
  formData: FormDetailModel;
  formRef: FormikProps<any> | null;
  name: string;
};

const FormFileUpload = (props: Props) => {
  const { formData, formRef, name } = props;
  const [selectedFile, setSelectedFile] = useState<File[] | undefined>();
  const regexFileExtension = new RegExp('(.*?).(png|jpeg|jpg|pdf)$');
  const [extensionError, setExtensionError] = useState(false);

  const changeSelectedFile = (files: FileList) => {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (!regexFileExtension.test(files[i].name)) {
          setExtensionError(true);
          return false;
        }
      }
    }

    setExtensionError(false);

    if (files && files.length > 0) {
      setSelectedFile([...files]);
      formikFileUpload.setFieldValue('fileUpload', [...files]);
      formikFileUpload.validateForm();
      formRef?.setFieldValue(name, [...files]);
      formRef?.validateForm();
    } else {
      setSelectedFile(undefined);
      formRef?.setFieldValue(name, []);
      formRef?.validateForm();
    }
  };

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

    if (formRef && formRef.values[name] && formData.isRequired) {
      formikFileUpload.setFieldValue('fileUpload', formRef.values[name]);
      if (formRef.values[name].length) {
        setSelectedFile(formRef.values[name]);
      }
      formikFileUpload.validateForm();
      formRef.validateField(name);
    }
  }, [formRef?.values[name]]);
  return formRef && formRef.values[name] !== undefined ? (
    <Wrapper justifyContent='flex-start' direction='column' width='100%'>
      <Wrapper gap='1rem'>
        <Text
          color='#000000'
          textAlign='left'
          fontSize='1.4rem'
          fontWeight='bold'
        >
          <span>{formData.text}</span>
        </Text>
      </Wrapper>
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
                .jpg, and .png
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
