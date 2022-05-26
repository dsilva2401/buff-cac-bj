import React, { useState } from 'react';
import { FormDetailModel } from 'types/FormTypes';
import { FormContext } from './FormDrawerContext';

export const FormProvider: React.FC = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [nextDisabled, setNextDisabled] = useState<boolean>(false);
  const [backDisabled, setBackDisabled] = useState<boolean>(false);
  const [formModules, setFormModules] = useState([]);
  const [currentForm, setCurrentForm] = useState(null);
  const [formData, setFormData] = useState<FormDetailModel[]>([]);

  return (
    <FormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        backDisabled,
        setBackDisabled,
        nextDisabled,
        setNextDisabled,
        totalSteps,
        setTotalSteps,
        formModules,
        setFormModules,
        currentForm,
        setCurrentForm,
        formData,
        setFormData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
