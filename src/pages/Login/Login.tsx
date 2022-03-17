import React, { useCallback, useMemo, useRef } from 'react';
import { theme } from 'styles/theme';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'context/global/GlobalContext';
import { ReactComponent as BrijLogo } from 'assets/logos/svg/brij-colored.svg';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import LoginForm from 'components/LoginForm';
import Wrapper from 'components/Wrapper';
import { useHistory } from 'react-router-dom';
import { RoutesHashMap } from 'routes';

const Login: React.FC = () => {
  const { setIsMenuOpen, signInRedirect, setSignInRedirect } = useGlobal();
  const history = useHistory();
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });

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

  // create a copy of signInRedirect so it doesn't change when singInRedirect
  // sets to empty which will cause the redirection to occur again
  // We will fix this once the user will be in the global context

  const redirect = useRef<string>(signInRedirect);

  const onLogin = useCallback(() => {
    let link = redirect.current || RoutesHashMap.Collection.path;

    if (redirect.current) {
      setSignInRedirect('');
    }

    history.push(link);
  }, [history, redirect, setSignInRedirect]);

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
        <LoginForm onLogin={onLogin} />
      </Wrapper>
    </>
  );
};

export default Login;
