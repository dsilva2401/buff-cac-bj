import React, { useCallback, useMemo } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ReactComponent as BrijLogo } from 'assets/logos/svg/brij-colored.svg';
import { useGlobal } from 'context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { RoutesHashMap } from 'routes';
import { Helmet } from 'react-helmet';
import { theme } from 'styles/theme';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import LoginForm from 'components/LoginForm';
import Wrapper from 'components/Wrapper';

const Login: React.FC = () => {
  const { setIsMenuOpen } = useGlobal();
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });
  const history = useHistory();

  const logo = useMemo(() => <BrijLogo fill={theme.primary} />, []);

  const menuButton = useMemo(
    () => (
      <Wrapper width='100%' justifyContent='flex-end'>
        <IconButton
          variant='dark'
          iconName='menu'
          onClick={() => setIsMenuOpen(true)}
        />
      </Wrapper>
    ),
    [setIsMenuOpen]
  );

  const onLogin = useCallback(() => {
    history.push(RoutesHashMap.Collection.path);
  }, [history]);

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='space-between'
        alignItems='center'
        position='relative'
        overflow='auto'
      >
        <PageHeader
          border
          title={t('pageHeaderTitle')}
          logo={logo}
          actionButton={menuButton}
        />
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY}
        >
          <LoginForm onLogin={onLogin} />
        </GoogleReCaptchaProvider>
      </Wrapper>
    </>
  );
};

export default Login;
