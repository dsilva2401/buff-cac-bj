import { FormDetailModel } from 'types/FormTypes';
import { FormikProps, useFormik } from 'formik';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import { useEffect } from 'react';
import EditTextArea from 'components/EditTextArea';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

type Props = {
  formData: FormDetailModel;
  formRef: FormikProps<any> | null;
  name: string;
};

const FormTextArea = (props: Props) => {
  const { formData, formRef, name } = props;

  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.formDrawer.textArea',
  });

  const formikTextArea = useFormik({
    initialValues: {
      textArea: '',
    },
    validationSchema: Yup.object({
      textArea: Yup.string().max(600, 'Max characters 600'),
    }),
    onSubmit: () => {},
  });

  const handleBlur = () => {};

  const handleFocus = () => {};

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
        fontSize='1.2rem'
        fontWeight='bold'
      >
        <span>{formData.text}</span>
      </Text>
      <Text color='#98A3AA' textAlign='left' fontSize='0.8rem' fontWeight='600'>
        <span>{formData.subText}</span>
      </Text>
      <Wrapper direction='column' margin='12px 0 0 0 '>
        <EditTextArea
          name='textArea'
          rows={formData.isLongQuestion ? 4 : 1}
          placeholder={t('placeHolder')}
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
          formikTextArea.errors.textArea && (
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
