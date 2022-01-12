import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { RoutesHashMap } from 'routes';
import ForgotPasswordForm from 'components/ForgotPasswordForm';

const ForgotPassword: React.FC = () => {
  const history = useHistory();

  const goBack = useCallback(() => {
    history.push(RoutesHashMap.Login.path)
  }, [history])

  return <ForgotPasswordForm goBack={goBack} />;
};

export default ForgotPassword;
