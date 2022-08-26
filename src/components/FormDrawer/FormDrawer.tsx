import Wrapper from 'components/Wrapper';
import Text from 'components/Text';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import {
  Switch,
  useRouteMatch,
  useHistory,
  useLocation,
  Route,
} from 'react-router-dom';
import FormDropDown from './components/FormDropDown';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
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
import { ModuleInfoType } from 'types/ProductDetailsType';
import FormCompletionPage from './components/FormCompletionPage';
import FormStartPage from './components/FormStartPage';
import { useAPI } from 'utils/api';
import { useGlobal } from 'context/global/GlobalContext';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './styles/formstyles.css';
import { useSwipeable } from 'react-swipeable';
import IconButton from 'components/IconButton/IconButton';
import FormStepper from './components/FormStepper';
import { showToast } from 'components/Toast/Toast';
import { useSuccessDrawerContext } from 'context/SuccessDrawerContext/SuccessDrawerContext';
import { useTranslation } from 'react-i18next';

type Props = {
  data: FormDetailModel[];
  formModuleData: ModuleInfoType;
  endScreenNavModuleIndex?: number;
  closeDrawer?: (
    closeDrawer: boolean,
    registrationFormCallback?: boolean
  ) => void;
  changeDrawerPage?: (moduleIdx: number) => void;
};

type initNames = {
  [key: string]: string | [];
};

export interface FormMatchParams {
  id: string;
  stepId: string;
}

const FormDrawer = (props: Props) => {
  const [validationYup, setValidationYup] = useState<any>({});
  const [initNameObjectYup, setNameObjectYup] = useState<any>({});
  const [localStorageSet, setLocalStorageSet] = useState(false);
  const { params } = useRouteMatch<FormMatchParams>();
  const {
    currentStep,
    setCurrentStep,
    completionScreen,
    setCompletionScreen,
    setTotalSteps,
    startScreen,
    setStartScreen,
    nextDisabled,
    backDisabled,
  } = useFormContext();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const {
    data,
    formModuleData,
    endScreenNavModuleIndex,
    closeDrawer,
    changeDrawerPage,
  } = props;
  const route = useHistory();
  const location = useLocation();
  const formik = useRef<FormikProps<any>>(null);
  const [formOrder, setFormOrder] = useState<string[]>([]);
  const [transistionAnimation, setTransistionAnimation] =
    useState<string>('right-to-left');
  const {
    user,
    logEvent,
    slug,
    isPreviewMode,
    setFormRegistration,
    brandTheme,
    previewEvent,
  } = useGlobal();
  const {
    openDrawer,
    setMeta,
    showSuccess,
    closeSuccess,
    closeDrawer: closeSuccessDrawer,
  } = useSuccessDrawerContext();

  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.formDrawer',
  });

  useEffect(() => {
    setTotalSteps(data.length);
  }, [setTotalSteps, data]);

  useEffect(() => {
    if (previewEvent && previewEvent.type === 'changeFormStep') {
      if (previewEvent.data.step === currentStep) {
        return;
      }
      if (parseInt(previewEvent.data.step) == previewEvent.data.step) {
        route.push(`/c/${id}/form/step/${previewEvent.data.step}`);
      } else {
        route.push(`/c/${id}/form/${previewEvent.data.step}`);
      }
      if (previewEvent.data.step !== 'complete') {
        setCompletionScreen(false);
      }
      if (previewEvent.data.step !== 'start') {
        setStartScreen(false);
      }
    }
  }, [previewEvent, currentStep]);

  const [submitForm] = useAPI<any>(
    {
      method: 'POST',
      endpoint: 'form/submit_form',
      onSuccess: (data: { responseId: string; success: boolean }) => {
        logEvent({
          eventType: 'ENGAGEMENTS',
          event: 'FORM_SUBMISSION',
          moduleType: formModuleData.type,
          moduleId: formModuleData.id,
          data: {
            registrationForm: endScreenNavModuleIndex === undefined,
          },
        });
        if (endScreenNavModuleIndex === undefined) {
          setIsFormSubmitting(false);
          setMeta({
            title: 'Form Completed',
            description: 'Thank you for your submission!',
          });

          showSuccess();
        }
        if (
          endScreenNavModuleIndex !== undefined &&
          closeDrawer &&
          changeDrawerPage &&
          !isPreviewMode
        ) {
          // remove form registraion as user already submitted it.
          setFormRegistration(null);
          closeDrawer(true, true);
          changeDrawerPage(endScreenNavModuleIndex);
          localStorage.removeItem('brij-form-registration');
          localStorage.setItem('brij-form-registration-complete', 'true');
          sessionStorage.removeItem('brij-registration-values');
          // if there isn't a current user than call update after a registration
          if (!user?.uid) {
            localStorage.setItem('brij-form-user-update-id', data.responseId);
          }
        }
        if (endScreenNavModuleIndex !== undefined) {
          // remove form registraion as user already submitted it.
          setFormRegistration(null);
          closeSuccessDrawer();
          return;
        }
        if (!isPreviewMode) {
          localStorage.setItem('brij-form-complete', 'true');
        }
        // if no end screen content go back to main page
        if (!formModuleData.endScreenContent && closeDrawer) {
          closeDrawer(true);
          sessionStorage.removeItem('brij-form');
          return;
        }
        setIsFormSubmitting(false);
        localStorage.setItem('brij-form-complete', 'true');
        route.push(`/c/${id}/form/complete`);
      },
      onError: () => {
        showToast({
          message: t('formSubmissionError'),
          type: 'error',
        });
        setIsFormSubmitting(false);
        closeSuccessDrawer();
      },
    },
    null,
    true
  );

  useEffect(() => {
    const isFormComplete = localStorage.getItem('brij-form-complete');
    if (isFormComplete && endScreenNavModuleIndex === undefined) {
      route.push(`/c/${id}/form/complete`);
      return;
    }
    let showStartScreen: string | null;
    if (endScreenNavModuleIndex !== undefined) {
      showStartScreen = sessionStorage.getItem(
        'brij-start-screen-shown-registration'
      );
    } else {
      showStartScreen = localStorage.getItem('brij-start-screen-shown');
    }
    if (
      formModuleData.startScreenContent &&
      (!showStartScreen || isPreviewMode)
    ) {
      setCurrentStep(1);
      route.push(`/c/${id}/form/start`);
      return;
    }

    if (
      !location.pathname.includes(`form/step`) &&
      !location.pathname.includes(`form/start`) &&
      !location.pathname.includes(`form/complete`)
    ) {
      route.push(`/c/${id}/form/step/1`);
    }
  }, []);

  useEffect(() => {
    //create formik inital values
    // this is to play nicely with the api call as the order needs to be persisted.
    if (data && !localStorageSet) {
      const initNamesObject: initNames = {};
      const validationObject: any = {};
      let createFormOrder: string[] = [];
      data.forEach((value, idx) => {
        if (
          value.type === FormDetailTypesEnum.CHECKBOX ||
          value.type === FormDetailTypesEnum.FILE
        ) {
          initNamesObject[`${value.type}${idx + 1}`] = [];
        } else {
          initNamesObject[`${value.type}${idx + 1}`] = '';
        }
        createFormOrder.push(`${value.type}${idx + 1}`);
      });
      setFormOrder(createFormOrder);

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
      if (formik.current) {
        try {
          formik.current.validateForm();
        } catch {}
      }
    }
  }, [data]);

  useEffect(() => {
    let brijFormRegistrationIndex = localStorage.getItem(
      'brij-form-registration'
    );
    let form: string | null;
    if (brijFormRegistrationIndex !== null) {
      form = sessionStorage.getItem('brij-registration-values');
    } else {
      form = sessionStorage.getItem('brij-form');
    }
    if (!localStorageSet && form && formik.current) {
      let values = JSON.parse(form);
      if (Object.keys(values).length) {
        setNameObjectYup(values);
        // below exists for file persistence without a refresh.
        setLocalStorageSet(true);
      }
    }
  }, [initNameObjectYup, localStorageSet]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (
        !formik.current?.errors[getCurrentFormName(currentStep)] &&
        !nextDisabled &&
        !completionScreen
      ) {
        handleNextBtnClicked();
      }
    },
    onSwipedRight: () => {
      if (currentStep !== 1 && !backDisabled && !completionScreen) {
        handleBackBtnClicked();
      }
    },
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  const handleBtnSubmit = async () => {
    if (isPreviewMode) {
      setIsFormSubmitting(true);
      closeSuccess();
      openDrawer();

      setTimeout(() => {
        setIsFormSubmitting(false);
        setMeta({
          title: 'Form Completed',
          description: 'Thank you for your submission!',
        });
        showSuccess();

        if (!formModuleData.endScreenContent && closeDrawer) {
          closeDrawer(true);
        } else {
          route.push(`/c/${id}/form/complete`);
        }
      }, 1000);

      return;
    }
    //submit the form
    // prepare for submit.
    let answersArray: string[] = [];
    let formResults = formik.current?.values;
    formOrder.forEach((value) => {
      if (value.includes('file-upload')) {
        if (!formResults[value].length) {
          answersArray.push('');
        } else {
          answersArray.push(formResults[value][0].fileUrl);
        }
      } else if (value.includes('checkbox')) {
        const mutipleAns = formResults[value].join(',');
        answersArray.push(mutipleAns);
      } else if (
        formResults[value] === null ||
        formResults[value] === undefined
      ) {
        answersArray.push('');
      } else {
        answersArray.push(formResults[value]);
      }
    });
    setIsFormSubmitting(true);
    let brijFormRegistrationIndex = localStorage.getItem(
      'brij-form-registration'
    );
    openDrawer();

    await submitForm({
      user: user?.uid,
      formId: formModuleData.id,
      slug: slug,
      answers: answersArray,
    });
  };

  const handleNextBtnClicked = () => {
    if (startScreen) {
      setStartScreen(false);
      setTransistionAnimation('right-to-left');
      if (endScreenNavModuleIndex !== undefined) {
        sessionStorage.setItem('brij-start-screen-shown-registration', 'true');
      } else {
        localStorage.setItem('brij-start-screen-shown', 'true');
      }
      setTimeout(() => {
        route.push(`/c/${id}/form/step/${currentStep}`);
      }, 0);
      return;
    }

    if (currentStep !== data.length) {
      setTransistionAnimation('right-to-left');
      setTimeout(() => {
        route.push(`/c/${id}/form/step/${currentStep + 1}`);
      }, 0);
      setCurrentStep(currentStep + 1);
    }

    if (!isPreviewMode) {
      let brijFormRegistrationIndex = localStorage.getItem(
        'brij-form-registration'
      );
      if (brijFormRegistrationIndex !== null) {
        sessionStorage.setItem(
          'brij-registration-values',
          JSON.stringify(formik.current?.values)
        );
      } else {
        sessionStorage.setItem(
          'brij-form',
          JSON.stringify(formik.current?.values)
        );
      }
    }
  };

  const handleBackBtnClicked = async () => {
    if (currentStep !== 1) {
      setTransistionAnimation('left-to-right');
      setTimeout(() => {
        route.push(`/c/${id}/form/step/${currentStep - 1}`);
      }, 0);
      setCurrentStep(currentStep - 1);
    }

    if (!isPreviewMode) {
      let brijFormRegistrationIndex = localStorage.getItem(
        'brij-form-registration'
      );
      if (brijFormRegistrationIndex !== null) {
        sessionStorage.setItem(
          'brij-registration-values',
          JSON.stringify(formik.current?.values)
        );
      } else {
        sessionStorage.setItem(
          'brij-form',
          JSON.stringify(formik.current?.values)
        );
      }
    }
  };

  const getCurrentFormName = (currentStep: number) => {
    return `${data[currentStep - 1].type}${currentStep}`;
  };

  const renderComponentRoutes = (stepId: string, formik: FormikProps<any>) => {
    const stepIdInt = parseInt(stepId, 10);
    const moduleStepInt = stepIdInt - 1;
    const currentFormModule = data[moduleStepInt];

    switch (currentFormModule.type) {
      case FormDetailTypesEnum.DROP_DOWN:
        return (
          <FormDropDown
            name={getCurrentFormName(stepIdInt)}
            formRef={formik}
            formData={currentFormModule}
          />
        );

      case FormDetailTypesEnum.MULTIPLE_CHOICE:
        return (
          <FormMultipleChoice
            name={getCurrentFormName(stepIdInt)}
            formRef={formik}
            formData={currentFormModule}
          />
        );
      case FormDetailTypesEnum.TEXT:
        return (
          <FormTextArea
            name={getCurrentFormName(stepIdInt)}
            formRef={formik}
            formData={currentFormModule}
          />
        );
      case FormDetailTypesEnum.CHECKBOX:
        return (
          <FormCheckBox
            formData={currentFormModule}
            name={getCurrentFormName(stepIdInt)}
            formRef={formik}
          />
        );
      case FormDetailTypesEnum.FILE:
        return (
          <FormFileUpload
            formData={currentFormModule}
            name={getCurrentFormName(stepIdInt)}
            formRef={formik}
          />
        );
    }
  };

  const getCurrentTransition = () => {
    return transistionAnimation;
  };
  let { id } = params;

  return (
    <Formik
      enableReinitialize={true}
      innerRef={formik}
      initialValues={initNameObjectYup}
      onSubmit={() => {}}
      validationSchema={validationYup}
      validateOnChange={true}
    >
      {(formikProps) => (
        <Wrapper {...swipeHandlers} width='100%' height='100%'>
          {startScreen && (
            <Wrapper width='100%' position='absolute' top='20px'>
              <Text
                wrapperWidth='80%'
                whiteSpace='nowrap'
                overflow='hidden'
                textOverflow='ellipsis'
                fontSize='1.2rem'
                fontWeight='bold'
                padding='12px'
              >
                <span>{formModuleData.title}</span>
              </Text>
            </Wrapper>
          )}
          {!completionScreen && !startScreen && (
            <Wrapper width='100%' position='absolute' top='20px'>
              <Text
                wrapperWidth='80%'
                whiteSpace='nowrap'
                overflow='hidden'
                textOverflow='ellipsis'
                fontSize='1.2rem'
                fontWeight='bold'
                padding='12px'
              >
                <span>
                  {currentStep}/{data.length}
                </span>
              </Text>
            </Wrapper>
          )}
          {completionScreen && !formModuleData.endScreenContent && (
            <Wrapper width='100%' position='absolute' top='20px'>
              <Text
                wrapperWidth='80%'
                whiteSpace='nowrap'
                overflow='hidden'
                textOverflow='ellipsis'
                fontSize='1.2rem'
                fontWeight='bold'
                padding='12px'
              >
                <span>Submission Successful</span>
              </Text>
            </Wrapper>
          )}
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
                {!completionScreen && !startScreen && (
                  <FormStepper steps={data.length} />
                )}
                <Wrapper
                  width='100%'
                  height='100%'
                  justifyContent='space-between'
                  direction='column'
                  alignItems='center'
                  overflow='auto'
                >
                  <Wrapper width='100%' padding='0px 0px 20px 0px'>
                    <TransitionGroup
                      exit={true}
                      className={'form-drawer-transistion'}
                    >
                      <CSSTransition
                        timeout={500}
                        key={location.key}
                        classNames={
                          transistionAnimation === 'right-to-left'
                            ? 'right-to-left'
                            : 'left-to-right'
                        }
                      >
                        <Switch location={location}>
                          <Wrapper className='abs-pos' width='100%'>
                            <Wrapper position='relative' width='100%'>
                              <FormProtectedRoute
                                exact={true}
                                totalSteps={data.length}
                                path={`/c/${id}/form/step/:stepId`}
                                render={({
                                  match: {
                                    params: { stepId },
                                  },
                                }) => (
                                  <FromStepWrapper>
                                    {Object.keys(formikProps.values).length ? (
                                      renderComponentRoutes(
                                        stepId ?? '',
                                        formikProps
                                      )
                                    ) : (
                                      <LoadingIndicator />
                                    )}
                                  </FromStepWrapper>
                                )}
                              />
                              <Route
                                path={`/c/${id}/form/complete`}
                                render={() => (
                                  <FormCompletionPage
                                    formData={formModuleData}
                                  />
                                )}
                              />
                              <Route
                                path={`/c/${id}/form/start`}
                                render={() => (
                                  <FormStartPage formData={formModuleData} />
                                )}
                              />
                            </Wrapper>
                          </Wrapper>
                        </Switch>
                      </CSSTransition>
                    </TransitionGroup>
                  </Wrapper>
                  {!completionScreen && (
                    <Wrapper
                      alignItems='flex-end'
                      width='100%'
                      direction='row'
                      gap='0.5rem'
                    >
                      {/* Check current step in module then get name and see form status */}
                      {/* <Button onClick={() => handleNextBtnClicked()} disabled={!!formik.errors?.dropDown} variant='dark'> */}
                      {currentStep !== 1 && (
                        // 1px margin to account for box shadow bleeding
                        <Wrapper margin='1px'>
                          <IconButton
                            variant='light'
                            iconName='chevron-left'
                            onClick={() => handleBackBtnClicked()}
                            disabled={backDisabled}
                          />
                        </Wrapper>
                      )}
                      {currentStep === data.length ? (
                        !!isFormSubmitting ? (
                          <LoadingIndicator />
                        ) : (
                          <Button
                            disabled={!formik.current?.isValid || nextDisabled}
                            onClick={() => handleBtnSubmit()}
                            variant='dark'
                            brandTheme={brandTheme}
                          >
                            {t('submit')}
                          </Button>
                        )
                      ) : (
                        <Button
                          disabled={
                            !!formik.current?.errors[
                              getCurrentFormName(currentStep)
                            ] || nextDisabled
                          }
                          onClick={() => handleNextBtnClicked()}
                          variant='dark'
                          brandTheme={brandTheme}
                        >
                          {t('next')}
                        </Button>
                      )}
                    </Wrapper>
                  )}
                </Wrapper>
              </Wrapper>
            </ModuleWrapper>
          </Wrapper>
        </Wrapper>
      )}
    </Formik>
  );
};

export default FormDrawer;
