import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { FormDetailModel } from 'types/FormTypes';
import { useFormik } from 'formik';
import FormSelectInput from './FormSelectInput';
import { useTranslation } from 'react-i18next';

type Props = {
  formRef: FormikProps<any> | null;
  name: string;
  formData: FormDetailModel;
};

const FormDropDown = (props: Props) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.formDrawer.dropDown',
  });
  const selectText = t('selectText');
  const { formRef, name, formData } = props;

  const formikDropDown = useFormik({
    initialValues: {
      dropDown: '',
    },
    onSubmit: () => {},
  });

  useEffect(() => {
    if (formRef && !formRef.values[name] && formData.isRequired) {
      formRef.validateField(name);
    }

    if (formRef && formRef.values[name] && !formikDropDown.values.dropDown) {
      formikDropDown.setFieldValue('dropDown', formRef.values[name]);
      formRef.validateField(name);
    }
  }, [formRef?.values[name]]);

  return (
    <Wrapper width='100%'>
      <Wrapper
        width='100%'
        direction='column'
        justifyContent='flex-start'
        alignItems='center'
        margin='0 0 1rem 0'
      >
        {/* This should be passed in title from BE */}
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
        <Wrapper width='100%'>
          {formRef && formRef.values[name] !== undefined && (
            <FormSelectInput
              id='drop-down'
              selected={formRef.values[name]}
              label={selectText}
              onChange={async (value) => {
                await formikDropDown.setValues({ dropDown: value }, true);
                if (formikDropDown.isValid) {
                  await formRef.setFieldValue(name, value);
                  formRef.validateForm();
                }
              }}
              options={formData.options.map((value) => value.text)}
              placeholder={selectText}
              noInitValue={true}
            ></FormSelectInput>
          )}
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default FormDropDown;
