import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useGlobal } from '../../context/global/GlobalContext';
import brijLogo from 'assets/logos/svg/brij-colored.svg';
import PageFooter from 'components/PageFooter';
import PageHeader from 'components/PageHeader';
import SignUpForm from 'components/SignUpForm';
import IconButton from 'components/IconButton';
import Wrapper from 'components/Wrapper';
import Image from 'components/Image';
import { RoutesHashMap } from 'routes';

const SignUp: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signUp' });
  const logo = <Image width="auto" src={brijLogo} alt="brij-logo" />;
  const history = useHistory();

  const { signInRedirect, setSignInRedirect, setIsMenuOpen } = useGlobal();

  const redirectUser = useCallback((isNewEmailUser: boolean) => {
    let link = signInRedirect || RoutesHashMap.Collection.path;

    if (signInRedirect) {
      setSignInRedirect('');
    }

    history.push(link);
  }, [history, signInRedirect, setSignInRedirect])

  const menuButton = useMemo(
    () => (
      <Wrapper width="100%" justifyContent="flex-end">
        <IconButton variant="dark" iconName="menu" onClick={() => setIsMenuOpen(true)} />
      </Wrapper>
    ),
    [setIsMenuOpen]
  );

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      overflow='auto'
    >
      <PageHeader border title={t('pageHeaderTitle')} logo={logo} actionButton={menuButton} />
      <SignUpForm onSignup={redirectUser} />
      <PageFooter>
        <p>{t("existingUser")}</p>
        <Link to={RoutesHashMap.Login.path}>{t("signInLink")}</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default SignUp;
