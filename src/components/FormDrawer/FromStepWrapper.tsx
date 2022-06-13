import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import React, { useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FormMatchParams } from './FormDrawer';

type Props = {
  children: React.ReactNode;
};

const FromStepWrapper = (props: Props) => {
  const { setCurrentStep } = useFormContext();
  const { params } = useRouteMatch<FormMatchParams>();
  useEffect(() => {
    if (params.stepId) {
      setCurrentStep(parseInt(params.stepId, 10));
    }
  }, []);

  return <>{props.children}</>;
};

export default FromStepWrapper;
