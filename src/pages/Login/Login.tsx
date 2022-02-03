import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { RoutesHashMap } from 'routes';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'context/global/GlobalContext';
import useRedirectLoggedInUser from 'hooks/useRedirectLoggedInUser';
import brijLogo from 'assets/logos/svg/brij-colored.svg';
import PageFooter from 'components/PageFooter';
import PageHeader from 'components/PageHeader';
import IconButton from 'components/IconButton';
import LoginForm from 'components/LoginForm';
import Wrapper from 'components/Wrapper';
import Image from 'components/Image';
import Text from 'components/Text';

const Login: React.FC = () => {
  const { user, setIsMenuOpen } = useGlobal();
  const history = useHistory();
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
        <PageHeader border title={t('pageHeaderTitle')} logo={logo} actionButton={menuButton} />
        <LoginForm onForgotPasswordClick={() => {
          history.push(RoutesHashMap.ForgotPassword.path)
        }} />
        <PageFooter>
          <Text>
            <p>{t('newToBrij')}</p>
          </Text>
          <Link to={RoutesHashMap.Signup.path} style={{ textDecoration: 'none' }}>
            <Text color='#4B6EFA'>
              <p>{t('signUpLink')}</p>
            </Text>
          </Link>
        </PageFooter>
      </Wrapper>
    </>
  );
};

export default Login;
