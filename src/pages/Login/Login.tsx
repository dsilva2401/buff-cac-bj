import React, { useMemo } from 'react';
import { RoutesHashMap } from 'routes';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'context/global/GlobalContext';
import useRedirectLoggedInUser from 'hooks/useRedirectLoggedInUser';
import AnimatedWrapper from 'components/AnimatedWrapper';
import brijLogo from 'assets/logos/svg/brij-colored.svg';
import PageFooter from 'components/PageFooter';
import PageHeader from 'components/PageHeader';
import IconButton from 'components/IconButton';
import LoginForm from 'components/LoginForm';
import Wrapper from 'components/Wrapper';
import Image from 'components/Image';

const Login: React.FC = () => {
  const {
    user,
    setIsMenuOpen,
    pageTransition,
    setPageTransition,
  } = useGlobal();
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });

  const logo = useMemo(
    () => <Image width='auto' src={brijLogo} alt='Brij logo' />,
    []
  );

  const menuButton = useMemo(
    () => (
      <Wrapper width='100%' justifyContent='flex-end'>
        <IconButton variant='dark' iconName='menu' onClick={() => setIsMenuOpen(true)} />
      </Wrapper>
    ),
    [setIsMenuOpen]
  );

  useRedirectLoggedInUser(user);

  return (
    <AnimatedWrapper direction={pageTransition}>
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='space-between'
        alignItems='center'
        overflow='auto'
      >
        <PageHeader border title={t('pageHeaderTitle')} logo={logo} actionButton={menuButton} />
        <LoginForm />
        <PageFooter>
          <p>{t('newToBrij')}</p>
          <Link to={RoutesHashMap.Signup.path} onClick={() => setPageTransition('LEFT')}>
            {t('signUpLink')}
          </Link>
        </PageFooter>
      </Wrapper>
    </AnimatedWrapper>
  );
};

export default Login;
