import React, { useCallback } from 'react';
import { useGlobal } from 'context/global/GlobalContext';
import { useHistory } from 'react-router';
import { RoutesHashMap } from 'routes';
import AnimatedWrapper from 'components/AnimatedWrapper';
import ForgotPasswordForm from 'components/ForgotPasswordForm';

const ForgotPassword: React.FC = () => {
  const { pageTransition, setPageTransition } = useGlobal();
  const history = useHistory();

  const goBack = useCallback(() => {
    history.push(RoutesHashMap.Login.path)
    setPageTransition('LEFT');
  }, [history, setPageTransition])

  return (
    <AnimatedWrapper direction={pageTransition}>
      <ForgotPasswordForm
        goBack={goBack}
      />
    </AnimatedWrapper>
  );
};

export default ForgotPassword;
