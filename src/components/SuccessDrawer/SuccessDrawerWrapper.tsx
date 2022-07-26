import { useSuccessDrawerContext } from 'context/SuccessDrawerContext/SuccessDrawerContext';
import SuccessDrawer from './SuccessDrawer';

const SuccessDrawerWrapper = () => {
  const { open, success, closeDrawer, meta } = useSuccessDrawerContext();

  return (
    <SuccessDrawer
      isOpen={open}
      loading={!success}
      onCompleteAnimation={() => closeDrawer()}
      title={meta.title}
      description={meta.description}
      close={closeDrawer}
    />
  );
};

export default SuccessDrawerWrapper;
