import React, { useCallback } from 'react';
import brijLogo from 'assets/logos/svg/brij-colored.svg';
import Image from 'components/Image';
import PageFooter from 'components/PageFooter';
import PageHeader from 'components/PageHeader';
import SignUpForm from 'components/SignUpForm';
import Wrapper from 'components/Wrapper';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useGlobal } from '../../context/global/GlobalContext';

const SignUp: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signUp' });
  const logo = <Image width="auto" src={brijLogo} alt="brij-logo" />;
  const history = useHistory();

  const { signInRedirect, setSignInRedirect } = useGlobal();

  const redirectUser = useCallback((isNewEmailUser: boolean) => {
    let link = signInRedirect || '/collection';

    if (signInRedirect) {
      setSignInRedirect('');
    }

    history.push(link);
  }, [history, signInRedirect, setSignInRedirect])

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <PageHeader border title={t('pageHeaderTitle')} logo={logo} />
      <SignUpForm onSignup={redirectUser} />
      <PageFooter>
        <p>{t("existingUser")}</p>
        <Link to={"/"}>{t("signInLink")}</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default SignUp;
