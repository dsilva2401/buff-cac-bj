import RadioButtons from 'components/RadioButtons';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FormDetailModel } from 'types/FormTypes';
import { FormikProps } from 'formik';
import { FormMatchParams } from '../FormDrawer';

type Props = {
  formData: FormDetailModel;
  formRef: FormikProps<any> | null;
};

const FormMultipleChoice = (props: Props) => {
  const { formData, formRef } = props;
  const { setCurrentStep, currentStep } = useFormContext();
  const { params } = useRouteMatch<FormMatchParams>();
  const optionsArr = formData.options.map((value) => value.text);
  const defaultOption = formData.options.filter((value) => value.isDefault);
  return (
    formRef && (
      <RadioButtons
        defaultValue={formRef.values[currentStep]}
        options={optionsArr}
      />
    )
  );
};

export default FormMultipleChoice;
