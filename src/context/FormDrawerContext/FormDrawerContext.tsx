import React, { createContext, useContext } from 'react';
import { FormDetailModel } from 'types/FormTypes';

export type FormContextProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  totalSteps: number;
  setTotalSteps: React.Dispatch<React.SetStateAction<number>>;
  nextDisabled: boolean;
  setNextDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  backDisabled: boolean;
  setBackDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  formModules: Array<any>;
  setFormModules: React.Dispatch<React.SetStateAction<any>>;
  currentForm: any;
  setCurrentForm: React.Dispatch<React.SetStateAction<any>>;
  formData: FormDetailModel[];
  setFormData: React.Dispatch<React.SetStateAction<FormDetailModel[]>>;
  completionScreen: boolean;
  setCompletionScreen: React.Dispatch<React.SetStateAction<boolean>>;
  startScreen: boolean;
  setStartScreen: React.Dispatch<React.SetStateAction<boolean>>;
  fileUploading: boolean;
  setFileUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormContext = createContext<FormContextProps>({
  currentStep: 1,
  setCurrentStep: () => {},
  totalSteps: 0,
  setTotalSteps: () => {},
  nextDisabled: false,
  setNextDisabled: () => {},
  backDisabled: false,
  setBackDisabled: () => {},
  formModules: [],
  setFormModules: () => {},
  currentForm: null,
  setCurrentForm: () => {},
  formData: [],
  setFormData: () => {},
  completionScreen: false,
  setCompletionScreen: () => {},
  startScreen: false,
  setStartScreen: () => {},
  fileUploading: false,
  setFileUploading: () => {},
});

export const useFormContext = () => useContext(FormContext);
