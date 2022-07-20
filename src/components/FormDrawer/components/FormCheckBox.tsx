import { FormDetailModel, FormDetailOptions } from 'types/FormTypes';
import { FormikProps } from 'formik';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import { useEffect } from 'react';
import LoadingIndicator from 'components/LoadingIndicator';
import { useFormik } from 'formik';
import { Checkbox } from '@material-ui/core';
import { Label } from 'components/SelectInput/styles';
import { useGlobal } from 'context/global/GlobalContext';
import FormStyleWrapper from '../styles/FormStyleWrapper';
type Props = {
  formData: FormDetailModel;
  formRef: FormikProps<any> | null;
  name: string;
};

const FormCheckBox = (props: Props) => {
  const { brandTheme } = useGlobal();
  const { formData, formRef, name } = props;
  const formikCheckBox = useFormik({
    initialValues: {
      checked: [],
    },
    onSubmit: () => {},
  });
  const { checked }: { checked: string[] } = formikCheckBox.values;

  useEffect(() => {
    if (formRef && formData.isRequired) {
      formRef.validateField(name);
    }

    if (formRef && formRef.values[name].length && !checked.length) {
      formikCheckBox.setFieldValue('checked', formRef.values[name], true);
      formikCheckBox.validateField(name);
    }
  }, [formRef?.values[name]]);

  const handleChecked = (value: FormDetailOptions) => {
    if (formRef?.values[name].length && !checked.length) {
      return !!formRef.values[name].find((x: string) => x === value.text);
    } else if (checked.length) {
      return !!checked.find((x: string) => x === value.text);
    } else {
      return value.isDefault;
    }
  };

  return formRef && formRef.values[name] !== undefined && formData ? (
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
        aria-labelledby='checkbox-group'
        justifyContent='flex-start'
        direction='column'
        width='100%'
      >
        {formData.options.map((value, idx) => {
          return (
            <Wrapper key={idx} alignItems='center' justifyContent='flex-start'>
              <FormStyleWrapper brandTheme={brandTheme}>
                <Checkbox
                  id={value.text}
                  name='checked'
                  value={value.text}
                  className='form-checkbox'
                  checked={handleChecked(value)}
                  onChange={async (e) => {
                    formikCheckBox.handleChange(e);
                    let copy: string[] = [...checked];
                    if (!~copy.indexOf(e.target.value)) {
                      copy = [e.target.value, ...checked];
                    } else {
                      copy = copy.filter((value) => value !== e.target.value);
                    }
                    await formRef.setFieldValue(name, copy);
                    formRef.validateField(name);
                  }}
                ></Checkbox>
                <Label htmlFor={value.text}>{value.text}</Label>
              </FormStyleWrapper>
            </Wrapper>
          );
        })}
      </Wrapper>
    </Wrapper>
  ) : (
    <LoadingIndicator />
  );
};

export default FormCheckBox;
