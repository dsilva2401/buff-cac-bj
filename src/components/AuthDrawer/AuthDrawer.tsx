import ForgotPasswordForm from 'components/ForgotPasswordForm';
import LoadingIndicator from 'components/LoadingIndicator';
import LoginForm from 'components/LoginForm';
import PageFooter from 'components/PageFooter';
import SignUpForm from 'components/SignUpForm';
import Wrapper from 'components/Wrapper';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

enum AuthScreen {
  login = 'login',
  signup = 'signup',
  forgotPasssword = 'forgotPasssword'
}

interface AuthDrawerProps {
  onAuthComplete: () => void;
  html: string | undefined | null;
  onPersonalDetailshow?: () => void;
  showFooter?: boolean;
}

const AuthDrawer: React.FC<AuthDrawerProps> = ({
  onAuthComplete,
  onPersonalDetailshow = () => { },
  showFooter,
  html
}) => {
  const [authScreen, setAuthScreen] = useState<AuthScreen>(AuthScreen.login);
  const [loading, setLoading] = useState<boolean>(false);

  const { t: signInTranslation } = useTranslation('translation', { keyPrefix: 'signIn' });
  const { t: signUpTranslation } = useTranslation('translation', { keyPrefix: 'signUp' });

  const onSuccess = useCallback(() => {
    onAuthComplete();
    setLoading(true);
  }, [onAuthComplete, setLoading]);

  const authScreenToRender = useMemo(() => {
    switch (authScreen) {
      case AuthScreen.login:
        return (
          <LoginForm onLogin={onSuccess} onForgotPasswordClick={() => setAuthScreen(AuthScreen.forgotPasssword)} />
        )
      case AuthScreen.signup:
        return <SignUpForm onPersonalDetailshow={onPersonalDetailshow} onSignup={onSuccess} />
      case AuthScreen.forgotPasssword:
        return <ForgotPasswordForm goBack={() => setAuthScreen(AuthScreen.login)} />
      default:
        return <LoginForm onLogin={onSuccess} onForgotPasswordClick={() => setAuthScreen(AuthScreen.forgotPasssword)} />
    }
  }, [authScreen])

  const footerToRender = useMemo(() => {
    let onActionClick: any = () => { };
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
      case AuthScreen.forgotPasssword:
        onActionClick = () => { };
        descriptionText = '';
        actionText = '';
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

  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <Wrapper
      width='100%'
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      gap='1.2rem'
      overflow='auto'
      margin='2rem 0'
    >
      {
        html ? (
          <Wrapper
            width='100%'
            direction='column'
            justifyContent='center'
            alignItems='center'
            gap='1rem'
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : null
      }
      {authScreenToRender}
      {showFooter ? footerToRender : null}
    </Wrapper>
  );
}

export default AuthDrawer;
