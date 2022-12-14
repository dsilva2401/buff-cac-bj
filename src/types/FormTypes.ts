import { FormDetailTypesEnum } from './FormDetailsEnum';
export interface FormModuleModel {
  _id: string;
  name: string;
  title: string;
  enabled: boolean;
  active: boolean;
  brand: string;
  type: string;
  content: string;
  formDetails: FormDetailModel;
  autoDeploy: boolean;
}

export interface FormDetailOptions {
  text: string;
  isDefault: boolean;
}

export interface FormDetailModel {
  type: FormDetailTypesEnum;
  isRequired: boolean;
  text: string;
  options: FormDetailOptions[];
  subText: string;
  isLongQuestion?: boolean;
  allowedMultiple?: boolean;
}
