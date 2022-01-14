import React, { useMemo } from 'react';
import { RoutesHashMap } from 'routes';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'context/global/GlobalContext';
import { Link, useHistory } from 'react-router-dom';
import useRedirectLoggedInUser from 'hooks/useRedirectLoggedInUser';
import brijLogo from 'assets/logos/svg/brij-colored.svg';
import PageFooter from 'components/PageFooter';
import PageHeader from 'components/PageHeader';
import IconButton from 'components/IconButton';
import LoginForm from 'components/LoginForm';
import Wrapper from 'components/Wrapper';
import Image from 'components/Image';

const Login: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });
  const { user, setIsMenuOpen } = useGlobal();
  const history = useHistory();

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
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='space-between'
      alignItems='center'
      position='relative'
      overflow='auto'
    >
      <PageHeader border title={t('pageHeaderTitle')} logo={logo} actionButton={menuButton} />
      <LoginForm onForgotPasswordClick={() => history.push(RoutesHashMap.ForgotPassword.path)} />
      <PageFooter>
        <p>{t('newToBrij')}</p>
        <Link to={RoutesHashMap.Signup.path}>
          {t('signUpLink')}
        </Link>
      </PageFooter>
    </Wrapper>
  );
};

export default Login;
