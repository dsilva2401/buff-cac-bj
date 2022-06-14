import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import { FormProvider } from '../../context';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import FormStepper from './components/FormStepper';
import {
  Route,
  Switch,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import FormDropDown from './components/FormDropDown';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
// import FormProtectedRoute from './FormProtectedRoute';
import ModuleWrapper from 'components/ModuleWrapper';
import Button from 'components/Button';
import { FormDetailModel } from 'types/FormTypes';
import FormMultipleChoice from './components/FormMultipleChoice';
import { FormDetailTypesEnum } from 'types/FormDetailsEnum';
import FromStepWrapper from './FromStepWrapper';
import { FormikProps, Formik } from 'formik';
import FormTextArea from './components/FormTextArea';
import FormProtectedRoute from './FormProtectedRoute';
import LoadingIndicator from 'components/LoadingIndicator';
import FormCheckBox from './components/FormCheckBox';
import FormFileUpload from './components/FormFileUpload';

type Props = {
  data: FormDetailModel[];
};

type initNames = {
  [key: string]: string | [];
};

export interface FormMatchParams {
  id: string;
  stepId: string;
}

const FormDrawer = (props: Props) => {
  const [redirect, setRedirect] = useState(false);
  const [validationYup, setValidationYup] = useState<any>({});
  const [initNameObjectYup, setNameObjectYup] = useState<any>({});
  // const [formik, setFormik] = useState<FormikProps<any>>();
  const { params } = useRouteMatch<FormMatchParams>();
  const { currentStep, setCurrentStep, setFormData } = useFormContext();
  const { data } = props;
  // const { active, brand, content, enabled, formDetails, name, title, type } = props.data;
  const route = useHistory();
  const location = useLocation();
  const formik = useRef<FormikProps<any>>(null);

  useEffect(() => {
    if (!location.pathname.includes(`form/step`)) {
      route.push(`/c/${id}/form/step/1`);
    }
  }, []);

  useEffect(() => {
    //create formik inital values
    if (data) {
      const initNamesObject: initNames = {};
      const validationObject: any = {};
      data.forEach((value, idx) => {
        if (
          value.type === FormDetailTypesEnum.CHECKBOX ||
          value.type === FormDetailTypesEnum.FILE
        ) {
          initNamesObject[`${value.type}${idx + 1}`] = [];
        } else {
          initNamesObject[`${value.type}${idx + 1}`] = '';
        }
      });

      // formik.setValues(initNamesObj);
      //TODO add validations dynamicall and account for step greater than or less than steps.
      data.forEach((value, idx) => {
        switch (value.type) {
          case FormDetailTypesEnum.DROP_DOWN:
            if (value.isRequired) {
              validationObject[`${value.type}${idx + 1}`] =
                Yup.string().required();
            } else {
              validationObject[`${value.type}${idx + 1}`] = Yup.string();
            }
            break;
          case FormDetailTypesEnum.MULTIPLE_CHOICE:
            if (value.isRequired) {
              validationObject[`${value.type}${idx + 1}`] =
                Yup.string().required();
            } else {
              validationObject[`${value.type}${idx + 1}`] = Yup.string();
            }
            break;
          case FormDetailTypesEnum.TEXT:
            if (value.isRequired) {
              validationObject[`${value.type}${idx + 1}`] = Yup.string()
                .min(2)
                .max(600)
                .required();
            } else {
              validationObject[`${value.type}${idx + 1}`] = Yup.string();
            }
            break;
          case FormDetailTypesEnum.CHECKBOX:
            if (value.isRequired) {
              validationObject[`${value.type}${idx + 1}`] = Yup.array().min(1);
            } else {
              validationObject[`${value.type}${idx + 1}`] = Yup.array();
            }
            break;
          case FormDetailTypesEnum.FILE:
            if (value.isRequired) {
              validationObject[`${value.type}${idx + 1}`] = Yup.array().min(1);
            } else {
              validationObject[`${value.type}${idx + 1}`] = Yup.array();
            }
            break;
          default:
            break;
        }
      });
      setNameObjectYup(initNamesObject);
      setValidationYup(Yup.object().shape(validationObject));
    }
  }, [data]);

  const convertFilesToArrayForLocalStorage = () => {
    let valuesPersisted = { ...formik.current?.values };
    for (let i = 1; i < data.length; i++) {
      let currentFormModule = data[i - 1];
      if (currentFormModule.type === FormDetailTypesEnum.FILE) {
        valuesPersisted[`file-upload${i}`] = [];
      }
    }
    return valuesPersisted;
  };

  const handleNextBtnClicked = () => {
    if (currentStep !== data.length) {
      route.push(`/c/${id}/form/step/${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    }

    localStorage.setItem(
      'brij-form',
      JSON.stringify(convertFilesToArrayForLocalStorage())
    );
  };

  const handleBackBtnClicked = () => {
    if (currentStep !== 1) {
      route.push(`/c/${id}/form/step/${currentStep - 1}`);
      setCurrentStep(currentStep - 1);
    }

    localStorage.setItem(
      'brij-form',
      JSON.stringify(convertFilesToArrayForLocalStorage())
    );
  };

  const renderComponentRoutes = (stepId: string, formik: FormikProps<any>) => {
    const stepIdInt = parseInt(stepId, 10);
    const moduleStepInt = stepIdInt - 1;
    const currentFormModule = data[moduleStepInt];
    switch (currentFormModule.type) {
      case FormDetailTypesEnum.DROP_DOWN:
        return (
          <FormDropDown
            name={getCurrentFormName()}
            formRef={formik}
            formData={currentFormModule}
          />
        );

      case FormDetailTypesEnum.MULTIPLE_CHOICE:
        return (
          <FormMultipleChoice
            name={getCurrentFormName()}
            formRef={formik}
            formData={currentFormModule}
          />
        );
      case FormDetailTypesEnum.TEXT:
        return (
          <FormTextArea
            name={getCurrentFormName()}
            formRef={formik}
            formData={currentFormModule}
          />
        );
      case FormDetailTypesEnum.CHECKBOX:
        return (
          <FormCheckBox
            formData={currentFormModule}
            name={getCurrentFormName()}
            formRef={formik}
          />
        );
      case FormDetailTypesEnum.FILE:
        return (
          <FormFileUpload
            formData={currentFormModule}
            name={getCurrentFormName()}
            formRef={formik}
          />
        );
    }
  };

  const getCurrentFormName = () => {
    return `${data[currentStep - 1].type}${currentStep}`;
  };

  useEffect(() => {
    const form = localStorage.getItem('brij-form');

    if (form && formik.current && Object.keys(formik.current?.values).length) {
      let values = JSON.parse(form);
      if (Object.keys(values).length) {
        formik.current.setValues(values);
      }
    }
  }, [Object.keys(formik?.current?.values ?? {}).length]);

  useEffect(() => {
    // for testing purposes
    setTimeout(() => {
      console.log(formik.current);
    }, 2000);
  }, [formik?.current?.values]);

  let { id } = params;

  return (
    <Formik
      enableReinitialize={true}
      innerRef={formik}
      initialValues={initNameObjectYup}
      onSubmit={() => {}}
      validationSchema={validationYup}
    >
      {(formikProps) => (
        <Wrapper width='100%' height='100%' padding='3.75rem 0px 0px 0px'>
          <ModuleWrapper>
            <Wrapper
              width='100%'
              height='100%'
              direction='column'
              alignItems='center'
              gap='1.2rem'
              overflow='auto'
              margin='0 0 0 0'
            >
              <FormStepper steps={data.length}></FormStepper>
              <Wrapper
                padding='0 12px 0'
                width='100%'
                justifyContent='flex-start'
              >
                <Text fontSize={'0.8rem'} color={'#98A3AA'} textAlign='left'>
                  <span>
                    {currentStep}/{data.length}
                  </span>
                </Text>
              </Wrapper>
              <Wrapper
                width='100%'
                height='100%'
                justifyContent='space-between'
                direction='column'
                alignItems='center'
                overflow='auto'
              >
                <Switch key={location.key}>
                  <FormProtectedRoute
                    totalSteps={data.length}
                    path={`/c/${id}/form/step/:stepId`}
                    render={({
                      match: {
                        params: { stepId },
                      },
                    }) => (
                      <FromStepWrapper>
                        {Object.keys(formikProps.values).length ? (
                          renderComponentRoutes(stepId ?? '', formikProps)
                        ) : (
                          <LoadingIndicator />
                        )}
                      </FromStepWrapper>
                    )}
                  />
                </Switch>
                <Wrapper width='100%' direction='column' gap='0.5rem'>
                  {/* Check current step in module then get name and see form status */}
                  {/* <Button onClick={() => handleNextBtnClicked()} disabled={!!formik.errors?.dropDown} variant='dark'> */}
                  {currentStep === data.length ? (
                    <Button
                      disabled={!!formik.current?.errors[getCurrentFormName()]}
                      onClick={() => handleNextBtnClicked()}
                      variant='dark'
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      disabled={!!formik.current?.errors[getCurrentFormName()]}
                      onClick={() => handleNextBtnClicked()}
                      variant='dark'
                    >
                      Next
                    </Button>
                  )}

                  {currentStep !== 1 && (
                    <Button
                      onClick={() => handleBackBtnClicked()}
                      variant='light'
                    >
                      Back
                    </Button>
                  )}
                </Wrapper>
              </Wrapper>
            </Wrapper>
          </ModuleWrapper>
        </Wrapper>
      )}
    </Formik>
  );
};

export default FormDrawer;
