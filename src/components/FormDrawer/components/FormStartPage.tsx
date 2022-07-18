import HtmlWrapper from 'components/HtmlWrapper';
import { useFormContext } from 'context/FormDrawerContext/FormDrawerContext';
import { useEffect } from 'react';
import { ModuleInfoType } from 'types/ProductDetailsType';

type Props = {
  formData: ModuleInfoType;
};

export interface FormMatchParams {
  id: string;
  stepId: string;
}

const FormStartPage = (props: Props) => {
  const { setStartScreen } = useFormContext();

  useEffect(() => {
    setStartScreen(true);
  }, []);

  return (
    <HtmlWrapper
      width='100%'
      direction='column'
      dangerouslySetInnerHTML={{ __html: props.formData.startScreenContent }}
    />
  );
};

export default FormStartPage;
