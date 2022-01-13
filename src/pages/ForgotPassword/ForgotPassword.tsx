import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import Wrapper from 'components/Wrapper';
import ForgotPasswordForm from 'components/ForgotPasswordForm';

const ForgotPassword: React.FC = () => {
  const history = useHistory();

  const goBack = useCallback(() => {
    history.goBack();
  }, [history])

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='space-between'
      alignItems='center'
      position='relative'
      overflow='auto'
    >
      <ForgotPasswordForm goBack={goBack} />
    </Wrapper>
  );
};

export default ForgotPassword;
