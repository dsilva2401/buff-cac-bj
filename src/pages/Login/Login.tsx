import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'context/global/GlobalContext';
import useRedirectLoggedInUser from 'hooks/useRedirectLoggedInUser';
import brijLogo from 'assets/logos/svg/brij-colored.svg';
import IconButton from 'components/IconButton';
import PageHeader from 'components/PageHeader';
import LoginForm from 'components/LoginForm';
import Wrapper from 'components/Wrapper';
import Image from 'components/Image';

const Login: React.FC = () => {
  const { user, setIsMenuOpen } = useGlobal();
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });

  const logo = useMemo(
    () => <Image width='auto' src={brijLogo} alt='Brij logo' />,
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
