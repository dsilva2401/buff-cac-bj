import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import { RoutesHashMap } from 'routes';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import ForgotPasswordForm from 'components/ForgotPasswordForm';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'forgotPassword' });
  const history = useHistory();

  const goBack = useCallback(() => {
    history.push(RoutesHashMap.Login.path)
  }, [history])

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <ForgotPasswordForm goBack={goBack} />
    </>
  );
};

export default ForgotPassword;
