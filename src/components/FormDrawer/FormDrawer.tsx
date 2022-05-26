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
import { useEffect, useState } from 'react';
// import FormProtectedRoute from './FormProtectedRoute';
import ModuleWrapper from 'components/ModuleWrapper';
import Button from 'components/Button';
import { FormDetailModel } from 'types/FormTypes';
import FormMultipleChoice from './components/FormMultipleChoice';
import { FormDetailTypesEnum } from 'types/FormDetailsEnum';
import FromStepWrapper from './FromStepWrapper';

type Props = {
  data: FormDetailModel[];
};

type initNames = {
  [key: string]: string;
};

export interface FormMatchParams {
  id: string;
  stepId: string;
}

const FormDrawer = (props: Props) => {
  const [setRedirect] = useState(false);
  const { params } = useRouteMatch<FormMatchParams>();
  const { currentStep, setCurrentStep, setFormData } = useFormContext();
  const { data } = props;
  // const { active, brand, content, enabled, formDetails, name, title, type } = props.data;
  const route = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.includes(`form/step`)) {
      route.push(`/c/${id}/form/step/1`);
    }
  }, []);

  useEffect(() => {
    if (data) {
      setFormData(data);

      //create formik inital values
      const initNamesObj: initNames = {};
      const initValueNames = data.forEach(
        (value, idx) => (initNamesObj[idx + 1] = '')
      );

      formik.setValues(initNamesObj);
      //TODO add validations dynamicall and account for step greater than or less than steps.
    }
  }, [data]);

  const formik = useFormik({
    initialValues: {},
    enableReinitialize: true,
    validationSchema: Yup.object({}),
    onSubmit: (values) => {},
  });

  // const formik = useFormik({
  //   initialValues: {
  //     dropDown: '',
  //   },
  //   enableReinitialize: true,
  //   validationSchema: Yup.object({
  //     dropDown: Yup.string().required('Required'),
  //   }),
  //   onSubmit: (values) => { },
  // });

  const handleNextBtnClicked = () => {
    route.push(`/c/${id}/form/step/${currentStep + 1}`);
    setCurrentStep(currentStep + 1);
  };

  const handleBackBtnClicked = () => {
    route.push(`/c/${id}/form/step/${currentStep - 1}`);
    setCurrentStep(currentStep - 1);
  };

  const renderComponentRoutes = (stepId: string) => {
    const stepIdInt = parseInt(stepId, 10);
    const moduleStepInt = stepIdInt - 1;
    const currentFormModule = data[moduleStepInt];
    switch (currentFormModule.type) {
      case FormDetailTypesEnum.DROP_DOWN:
        return (
          <FormDropDown
            name='dropDown'
            formRef={formik}
            formData={currentFormModule}
          />
        );

      case FormDetailTypesEnum.MULTIPLE_CHOICE:
        return (
          <FormMultipleChoice formRef={formik} formData={currentFormModule} />
        );
    }
  };

  let { id } = params;

  return (
    <Wrapper width='100%' height='100%'>
      <ModuleWrapper>
        <Wrapper
          width='100%'
          height='100%'
          direction='column'
          alignItems='center'
          gap='1.2rem'
          overflow='auto'
          margin='3.75rem 0 0 0'
        >
          <FormStepper steps={data.length}></FormStepper>
          <Wrapper padding='0 12px 0' width='100%' justifyContent='flex-start'>
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
            {/* <Link title='hello' to={`/ app / login`}>
            test
          </Link> */}
            <Switch key={location.key}>
              {/* <FormProtectedRoute exact path={`${ path } / form`}
            render={(props) => <FromStepWrapper />} /> */}
              <Route
                path={`/c/${id}/form/step/:stepId`}
                render={({
                  match: {
                    params: { stepId },
                  },
                }) => (
                  <FromStepWrapper>
                    {renderComponentRoutes(stepId)}
                  </FromStepWrapper>
                )}
              />
            </Switch>
            <Wrapper width='100%' direction='column' gap='0.5rem'>
              {/* Check current step in module then get name and see form status */}
              {/* <Button onClick={() => handleNextBtnClicked()} disabled={!!formik.errors?.dropDown} variant='dark'> */}
              <Button onClick={() => handleNextBtnClicked()} variant='dark'>
                Next
              </Button>
              {currentStep !== 1 && (
                <Button onClick={() => handleBackBtnClicked()} variant='light'>
                  Back
                </Button>
              )}
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </ModuleWrapper>
    </Wrapper>
  );
};

export default FormDrawer;
