import RadioButtons from 'components/RadioButtons';
import { FormDetailModel } from 'types/FormTypes';
import { FormikProps } from 'formik';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import { useEffect } from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import { useFormik } from 'formik';
import FormStyleWrapper from '../styles/FormStyleWrapper';
import { useGlobal } from 'context/global/GlobalContext';

type Props = {
  formData: FormDetailModel;
  formRef: FormikProps<any> | null;
  name: string;
};

const FormMultipleChoice = (props: Props) => {
  const { brandTheme } = useGlobal();
  const { formData, formRef, name } = props;
  const optionsArr = formData.options.map((value) => value.text);

  const formikMultipleChoice = useFormik({
    initialValues: {
      multipleChoice: '',
    },
    onSubmit: () => {},
  });

  useEffect(() => {
    if (formRef && !formRef.values[name] && formData.isRequired) {
      formRef.validateField(name);
    }

    if (formRef && formRef.values[name]) {
      formikMultipleChoice.setFieldValue(
        'multipleChoice',
        formRef.values[name]
      );
      formikMultipleChoice.validateForm();
      formRef.validateForm();
    }
  }, [formRef?.values[name]]);
  return formRef && formRef.values[name] !== undefined ? (
    <Wrapper justifyContent='flex-start' direction='column' width='100%'>
      <Text
        color='#000000'
        textAlign='left'
        fontSize='1.2rem !important'
        fontWeight='bold'
      >
        <span>{formData.text}</span>
      </Text>
      <Text color='#98A3AA' textAlign='left' fontSize='0.8rem' fontWeight='600'>
        <span>{formData.subText}</span>
      </Text>
      <Wrapper
        margin='12px 0 0 0'
        alignItems='center'
        justifyContent='flex-start'
      >
        <FormStyleWrapper brandTheme={brandTheme}>
          <RadioButtons
            className='form-radio'
            name='multipleChoice'
            defaultValue={formikMultipleChoice.values.multipleChoice}
            options={optionsArr}
            onChange={async (value, e) => {
              await formikMultipleChoice.handleChange(e);
              if (formikMultipleChoice.isValid) {
                await formRef.setFieldValue(name, value);
                formRef.validateForm();
              }
            }}
          />
        </FormStyleWrapper>
      </Wrapper>
    </Wrapper>
  ) : (
    <LoadingIndicator />
  );
};

export default FormMultipleChoice;
