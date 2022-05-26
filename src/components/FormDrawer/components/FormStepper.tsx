import ModuleWrapper from 'components/ModuleWrapper';
import StepWrapper from 'components/StepWrapper';
import StepComp from 'components/StepWrapper/StepComp';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import React, { useEffect, useState } from 'react';

type Props = {
  steps: number;
};

const FormStepper = (props: Props = { steps: 5 }) => {
  const [stepWidth, setStepWidth] = useState(0);

  const { steps } = props;
  const { currentStep } = useFormContext();
  useEffect(() => {
    setStepWidth(100 / steps);
  }, [steps]);

  return (
    <StepWrapper
      stepWidth={stepWidth}
      width='100%'
      direction='row'
      justifyContent='space-around'
    >
      {Array(steps)
        .fill(null)
        .map((value, idx) => {
          return (
            <StepComp
              key={idx}
              background={idx + 1 <= currentStep ? '#4B6EFA' : '#E7EAEB'}
            ></StepComp>
          );
        })}
    </StepWrapper>
  );
};

export default FormStepper;
