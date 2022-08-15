import HtmlWrapper from 'components/HtmlWrapper';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import { useEffect } from 'react';
import { ModuleInfoType } from 'types/ProductDetailsType';

type Props = {
  formData: ModuleInfoType;
};

const FormCompletionPage = (props: Props) => {
  const { setCompletionScreen } = useFormContext();

  useEffect(() => {
    setCompletionScreen(true);
    localStorage.removeItem('brij-form');
  }, [setCompletionScreen]);

  return props.formData.endScreenContent ? (
    <>
      <HtmlWrapper
        width='100%'
        direction='column'
        dangerouslySetInnerHTML={{ __html: props.formData.endScreenContent }}
      />
    </>
  ) : (
    <Wrapper>
      <Text>Your responses were successfully submitted</Text>
    </Wrapper>
  );
};

export default FormCompletionPage;
