import LoginForm from 'components/LoginForm';
import PageFooter from 'components/PageFooter';
import SignUpForm from 'components/SignUpForm';
import Wrapper from 'components/Wrapper';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

enum AuthScreen {
  login = "login",
  signup = "signup"
}

interface AuthDrawerProps {
  onAuthComplete: () => void
}

const AuthDrawer: React.FC<AuthDrawerProps> = ({
  onAuthComplete
}) => {
  const [authScreen, setAuthScreen] = useState<AuthScreen>(AuthScreen.login);

  const { t: signInTranslation } = useTranslation('translation', { keyPrefix: 'signIn' });
  const { t: signUpTranslation } = useTranslation('translation', { keyPrefix: 'signUp' });

  const authScreenToRender = useMemo(() => {
    switch (authScreen) {
      case AuthScreen.login:
        return (
          <LoginForm onLogin={onAuthComplete} />
        )
      case AuthScreen.signup:
        return <SignUpForm onSignup={onAuthComplete} />
      default:
        return <LoginForm onLogin={onAuthComplete} />
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
    <Wrapper
      width="100%"
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      gap="1.2rem"
      overflow="auto"
      margin="2rem 0"
    >
      {authScreenToRender}
      {footerToRender}
    </Wrapper>
  );
}

export default AuthDrawer;
