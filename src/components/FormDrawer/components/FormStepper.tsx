import Wrapper from 'components/Wrapper';
import useElementSize from 'hooks/useElementSize';
import { useGlobal } from 'context/global/GlobalContext';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';

type Props = {
  steps: number;
};

const FormStepper = (props: Props = { steps: 5 }) => {
  const [stepWrapperRef, { width }] = useElementSize();
  const { currentStep } = useFormContext();
  const { brandTheme } = useGlobal();
  const { steps } = props;

  return (
    <Wrapper
      ref={stepWrapperRef}
      position='relative'
      direction='row'
      gap='0.25rem'
      width='100%'
    >
      {Array(steps)
        .fill(null)
        .map((value, index) => {
          return (
            <Wrapper
              height='5px'
              width={`${width / steps}px`}
              borderRadius='9px'
              overflow='hidden'
              background='#E7EAEB'
              key={`step-${index + 1}-${value}`}
            >
              <Wrapper
                height='100%'
                transition='0.4s ease'
                width={index > currentStep - 1 ? '0' : '100%'}
                background={brandTheme}
              />
            </Wrapper>
          );
        })}
    </Wrapper>
  );
};

export default FormStepper;
