import SelectInput from 'components/SelectInput';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FormDetailModel } from 'types/FormTypes';
import { FormMatchParams } from '../FormDrawer';

type Props = {
  module?: string[];
  formRef: FormikProps<any> | null;
  name: string;
  formData: FormDetailModel;
};

const FormDropDown = (props: Props) => {
  const { formRef, name, module, formData } = props;
  const { setCurrentStep } = useFormContext();
  const { params } = useRouteMatch<FormMatchParams>();

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
            fontSize='1.2rem'
            fontWeight='bold'
          >
            <span>{formData.text}</span>
          </Text>
        </Wrapper>
        {formRef && (
          <SelectInput
            id='hello'
            selected={formRef.values[name]}
            label='click to select'
            onChange={(value) => {
              formRef.handleChange(name)(value);
            }}
            options={formData.options.map((value) => value.text)}
            key='23'
            placeholder='click to select'
            noInitValue={true}
          ></SelectInput>
        )}
      </Wrapper>
    </Wrapper>
  );
};

export default FormDropDown;
