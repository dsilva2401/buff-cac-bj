import React from 'react';
import brijLogo from 'assets/logos/svg/brij-colored.svg';
import Image from 'components/Image';
import PageFooter from 'components/PageFooter';
import PageHeader from 'components/PageHeader';
import SignUpForm from 'components/SignUpForm';
import Wrapper from 'components/Wrapper';
import useRedirectLoggedInUser from 'hooks/useRedirectLoggedInUser';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useGlobal } from '../../context/global/GlobalContext';

const SignUp: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signUp' });
  const { user } = useGlobal();
  const logo = <Image width="auto" src={brijLogo} alt="brij-logo" />;

  useRedirectLoggedInUser(user);

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <PageHeader border title={t('pageHeaderTitle')} logo={logo} />
      <SignUpForm />
      <PageFooter>
        <p>{t("existingUser")}</p>
        <Link to={"/"}>{t("signInLink")}</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default SignUp;
