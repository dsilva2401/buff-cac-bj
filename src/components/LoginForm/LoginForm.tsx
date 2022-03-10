import React, { useState, useRef, useEffect } from 'react';
import { theme } from 'styles/theme';
import { Animated } from 'react-animated-css';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { useGlobal } from 'context/global/GlobalContext';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { ReactComponent as EmailLogo } from 'assets/logos/svg/email.svg';
import { ReactComponent as EmailLogoPrimary } from 'assets/logos/svg/email-primary.svg';
import FloatingLabelInput from 'components/FloatingLabelInput';
import useMagicLinkHandler from 'hooks/useMagicLinkHandler';
import LoadingIndicator from 'components/LoadingIndicator';
import useFirebaseError from 'hooks/useFirebaseError';
import SocialLogin from 'components/SocialLogin';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Text from 'components/Text';
import validator from 'validator';

import PersonalDetails from 'components/PersonalDetails';
interface LoginFormProps {
  isDrawer?: boolean;
  onLogin?: (isNewUser?: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin = () => {},
  isDrawer,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });
  const inputRef = useRef<HTMLInputElement>(null);
  const { retractDrawer, brandTheme } = useGlobal();
  const getErrorMessage = useFirebaseError();
  const location = useLocation();
  const auth = getAuth();

  const [emailRegistration, toggleEmailRegistration] = useState<boolean>(false);
  const [emailValidated, setEmailValidated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPersonalDetailsForm, togglePersonalDetailsForm] =
    useState<boolean>(false);

  // get magic link header
  const {
    handleMagicLink,
    loading: magicLinkLoading,
    error: magicLinkError,
    success,
  } = useMagicLinkHandler(username);

  const validateEmail = (value: string) => {
    if (validator.isEmail(value)) setEmailValidated(true);
    else setEmailValidated(false);
  };

  const handleUsernameChanged = (value: string) => {
    setUsername(value);
    validateEmail(value);
  };

  const handleLogin = async () => {
    setLoading(true);
    if (error !== '') setError('');
    createUserWithEmailAndPassword(
      auth,
      username,
      process.env.REACT_APP_DEFAULT_PASSWORD!
    )
      .then(() => {
        if (!isDrawer) {
          togglePersonalDetailsForm(true);
        } else {
          onLogin(true);
        }
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          handleMagicLink();
        } else {
          showToast({ message: getErrorMessage(error.code), type: 'error' });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (emailRegistration && inputRef !== null) inputRef.current?.focus();
  }, [emailRegistration]);

  if (showPersonalDetailsForm) {
    return <PersonalDetails onPersonalDetailsUpdate={onLogin} />;
  }

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      overflow='hidden'
      paddingTop={
        location.pathname === '/' || location.pathname === '' ? '2rem' : '0'
      }
    >
      <Animated
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={
          location.pathname === '/' || retractDrawer ? 0 : 300
        }
        animationOutDuration={
          location.pathname === '/' || retractDrawer ? 0 : 300
        }
        animationInDelay={location.pathname !== '/' && retractDrawer ? 200 : 0}
        animateOnMount
        isVisible={true}
        style={{ width: '100%' }}
      >
        <Wrapper
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          padding='0 1rem'
          gap='0.5rem'
          overflow='hidden'
          height='auto'
        >
          <SocialLogin
            isDrawer={isDrawer}
            setLoading={setLoading}
            onSuccess={onLogin}
          />
          <Wrapper
            direction='column'
            width='100%'
            justifyContent='center'
            alignItems='center'
            overflow='hidden'
            transition='0.2s'
            height={emailRegistration ? '60px' : '0px'}
            margin={emailRegistration ? '0' : '-0.5rem 0 0 0'}
          >
            <Wrapper width='100%'>
              <FloatingLabelInput
                ref={inputRef}
                value={username}
                placeholder={t('emailInput')}
                onChange={(event) => handleUsernameChanged(event.target.value)}
              />
            </Wrapper>
          </Wrapper>
          <Wrapper width='100%' justifyContent='center' alignItems='center'>
            {loading || magicLinkLoading ? (
              <LoadingIndicator />
            ) : (
              <Button
                variant='light'
                transition='0s'
                brandTheme={brandTheme}
                style={
                  !emailRegistration ? { border: '0', color: '#000000' } : {}
                }
                onClick={() => {
                  emailValidated
                    ? handleLogin()
                    : emailRegistration
                    ? showToast({ type: 'error', message: 'Invalid Email' })
                    : toggleEmailRegistration(!emailRegistration);
                }}
              >
                {emailRegistration ? (
                  <EmailLogoPrimary fill={brandTheme || theme.primary} />
                ) : (
                  <EmailLogo />
                )}
                {isDrawer ? t('registerWithEmail') : t('continueWithEmail')}
              </Button>
            )}
          </Wrapper>
          <Wrapper width='100%' justifyContent='center' padding='0 1rem'>
            <Text fontSize='0.7rem' textDecoration='unset'>
              <span>{magicLinkError}</span>
            </Text>
          </Wrapper>
          <Wrapper width='100%' justifyContent='center' padding='0 1rem'>
            <Text fontSize='0.7rem' textDecoration='unset'>
              <span>{success}</span>
            </Text>
          </Wrapper>
        </Wrapper>
      </Animated>
    </Wrapper>
  );
};

export default LoginForm;
