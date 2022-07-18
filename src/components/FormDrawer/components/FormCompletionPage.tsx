import HtmlWrapper from 'components/HtmlWrapper';
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

  return (
    <>
      <HtmlWrapper
        width='100%'
        direction='column'
        dangerouslySetInnerHTML={{ __html: props.formData.endScreenContent }}
      />
    </>
  );
};

export default FormCompletionPage;
