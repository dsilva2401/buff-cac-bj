import LoginForm from 'components/LoginForm';
import PageFooter from 'components/PageFooter';
import SignUpForm from 'components/SignUpForm';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

enum AuthScreen {
  login = "login",
  signup = "signup"
}

const AuthDrawer = () => {
  const [authScreen, setAuthScreen] = useState<AuthScreen>(AuthScreen.login);

  const { t: signInTranslation } = useTranslation('translation', { keyPrefix: 'signIn' });
  const { t: signUpTranslation } = useTranslation('translation', { keyPrefix: 'signUp' });

  const authScreenToRender = useMemo(() => {
    switch (authScreen) {
      case AuthScreen.login:
        return (
          <LoginForm />
        )
      case AuthScreen.signup:
        return <SignUpForm />
      default:
        return <LoginForm />
    }
  }, [authScreen])

  const footerToRender = useMemo(() => {
    let onActionClick: any = () => {};
    let descriptionText: string = ''; 
    let actionText: string = '';

    switch (authScreen) {
      case AuthScreen.login:
        onActionClick = () => setAuthScreen(AuthScreen.signup);
        descriptionText = signInTranslation('newToBrij');
        actionText = signInTranslation('signUpLink');
        break;
      case AuthScreen.signup:
        onActionClick = () => setAuthScreen(AuthScreen.login);
        descriptionText = signUpTranslation('existingUser');
        actionText = signUpTranslation('signInLink');
        break;
      default:
        onActionClick = () => setAuthScreen(AuthScreen.signup);
        descriptionText = signInTranslation('newToBrij');
        actionText = signInTranslation('signUpLink');
    }

    return (
      <PageFooter>
        <p>{descriptionText}</p>
        <p onClick={onActionClick}>{actionText}</p>
      </PageFooter>
    )
  }, [authScreen, signInTranslation, signUpTranslation])

  return (
    <>
      {authScreenToRender}
      {footerToRender}
    </>
  );
}

export default AuthDrawer;
