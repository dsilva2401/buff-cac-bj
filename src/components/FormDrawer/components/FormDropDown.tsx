import SelectInput from 'components/SelectInput';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FormDetailModel } from 'types/FormTypes';
import { FormMatchParams } from '../FormDrawer';
import * as Yup from 'yup';
import { useFormik } from 'formik';

type Props = {
  formRef: FormikProps<any> | null;
  name: string;
  formData: FormDetailModel;
};

const FormDropDown = (props: Props) => {
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
      {/* <EditInput onChange={() => { }} value="" placeholder='dropDown' type="hidden" /> */}
      <Wrapper
        width='100%'
        direction='column'
        justifyContent='flex-start'
        alignItems='center'
        margin='0 0 1rem 0'
      >
        {/* This should be passed in title from BE */}
        <Wrapper padding='0 12px 0' width='100%'>
          <Text
            color='#000000'
            textAlign='left'
            fontSize='1.4rem'
            fontWeight='bold'
          >
            <span>{formData.text}</span>
          </Text>
        </Wrapper>
        <Wrapper margin='24px 0 0 0' width='100%'>
          {formRef && formRef.values[name] !== undefined && (
            <SelectInput
              id='drop-down'
              selected={formRef.values[name]}
              label='click to select'
              onChange={async (value) => {
                await formikDropDown.setValues({ dropDown: value }, true);
                if (formikDropDown.isValid) {
                  await formRef.setFieldValue(name, value);
                  formRef.validateForm();
                }
              }}
              options={formData.options.map((value) => value.text)}
              placeholder='click to select'
              noInitValue={true}
            ></SelectInput>
          )}
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default FormDropDown;
