import React, { useMemo } from 'react';
import { theme } from 'styles/theme';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'context/global/GlobalContext';
import { ReactComponent as BrijLogo } from 'assets/logos/svg/brij-colored.svg';
import useRedirectLoggedInUser from 'hooks/useRedirectLoggedInUser';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import LoginForm from 'components/LoginForm';
import Wrapper from 'components/Wrapper';

const Login: React.FC = () => {
  const { user, setIsMenuOpen } = useGlobal();
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });

  const logo = useMemo(
    () => <BrijLogo fill={theme.primary} />,
    []
  );

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

  useRedirectLoggedInUser(user);

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
        <LoginForm />
      </Wrapper>
    </>
  );
};

export default Login;
