import { useRouteMatch } from 'react-router-dom';
import { FormDetailModel } from 'types/FormTypes';
import { FormikProps, FormikValues, useFormik } from 'formik';
import { FormMatchParams } from '../FormDrawer';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import { useEffect, useState } from 'react';
import EditTextArea from 'components/EditTextArea';
import * as Yup from 'yup';

type Props = {
  formData: FormDetailModel;
  formRef: FormikProps<any> | null;
  name: string;
};

const FormTextArea = (props: Props) => {
  const { formData, formRef, name } = props;
  const [firstBlur, setFirstBlur] = useState(false);
  const { params } = useRouteMatch<FormMatchParams>();
  const optionsArr = formData.options.map((value) => value.text);
  const defaultOption = formData.options.filter((value) => value.isDefault);

  const formikTextArea = useFormik({
    initialValues: {
      textArea: '',
    },
    validationSchema: Yup.object({
      textArea: Yup.string()
        .min(2, 'Must have at least two characters')
        .max(600, 'Max characters 600'),
    }),
    onSubmit: () => {},
  });

  const handleBlur = () => {
    if (!firstBlur) {
      setFirstBlur(true);
    }
  };

  const handleFocus = () => {
    if (firstBlur) {
      setFirstBlur(false);
    }
  };

  useEffect(() => {
    if (formRef && !formRef.values[name] && formData.isRequired) {
      formRef.validateField(name);
    }

    if (formRef && formRef.values[name] && !formikTextArea.values.textArea) {
      formikTextArea.setFieldValue('textArea', formRef.values[name]);
      formRef.validateField(name);
    }
  }, [formRef?.values[name]]);

  return formRef ? (
    <Wrapper justifyContent='flex-start' direction='column' width='100%'>
      <Text
        color='#000000'
        textAlign='left'
        fontSize='1.4rem'
        fontWeight='bold'
      >
        <span>{formData.text}</span>
      </Text>
      {/* This is actually a text area!! */}
      <Wrapper direction='column' margin='24px 0 0 0 '>
        <EditTextArea
          name='textArea'
          rows={4}
          placeholder='Type your answer here...'
          value={formikTextArea.values.textArea}
          onChange={(value, e) => {
            formikTextArea.handleChange(e);
            formRef.setFieldValue(name, value);
            formRef.validateForm();
          }}
          onBlur={(value) => handleBlur()}
          onFocus={() => handleFocus()}
        ></EditTextArea>
        {formikTextArea.touched &&
          formikTextArea.dirty &&
          formikTextArea.errors.textArea &&
          firstBlur && (
            <Text color='red' fontSize='0.8rem'>
              <span>{formikTextArea.errors.textArea}</span>
            </Text>
          )}
      </Wrapper>
    </Wrapper>
  ) : (
    <></>
  );
};

export default FormTextArea;
