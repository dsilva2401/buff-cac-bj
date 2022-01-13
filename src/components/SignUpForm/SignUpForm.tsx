import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import useMagicLinkHandler from 'hooks/useMagicLinkHandler';
import LoadingIndicator from 'components/LoadingIndicator';
import PersonalDetails from 'components/PersonalDetails';
import SocialLogin from 'components/SocialLogin';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';

interface SignUpFormProps {
  onSignup?: (...args: any[]) => void,
  onPersonalDetailshow?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSignup = () => { },
  onPersonalDetailshow = () => { }
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'signUp' });
  const auth = getAuth();

  const [usingMagicLink, setUsingMagicLink] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPersonalDetailsForm, togglePersonalDetailsForm] = useState<boolean>(false);

  // get magic link header
  const {
    handleMagicLink,
    loading: magicLinkLoading,
    error,
    success,
  } = useMagicLinkHandler(email, true);

  const signUpWithEmailAndPassword = () => {
    setLoading(true);
    if (errorMessage !== '') setErrorMessage('');
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        togglePersonalDetailsForm(true);
        onPersonalDetailshow();
        showToast({ message: t('signUpToastMessage'), type: 'success' });
      })
      .catch((error) => {
        if (error.code.includes('auth/weak-password')) {
          setErrorMessage('Please enter a stronger password.');
        } else if (error.code.includes('auth/email-already-in-use')) {
          setErrorMessage('Email already in use.');
        } else {
          setErrorMessage('Unable to register. Please try again later.');
        }
        setLoading(false);
        showToast({ message: errorMessage, type: 'error' });
      })
      .finally(() => {
        setLoading(false);
      })
  };

  const passwordInput = !usingMagicLink ? (
    <Input
      type='password'
      value={password}
      margin='0 0 1rem'
      autoCapitalize='none'
      placeholder={t('passwordInput')}
      onChange={({ target: { value } }) => setPassword(value)}
    />
  ) : null;

  if (showPersonalDetailsForm) {
    return <PersonalDetails onPersonalDetailsUpdate={onSignup} />
  }

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      padding='2rem 1rem'
      gap='1.2rem'
    >
      <SocialLogin
        setLoading={setLoading}
        onSuccess={onSignup}
      />
      <Wrapper justifyContent='center' alignItems='center'>
        <Text fontSize='1.2rem' color='#98A3AA'>
          <p>or</p>
        </Text>
      </Wrapper>
      <Wrapper
        direction='column'
        width='100%'
        justifyContent='center'
        alignItems='center'
      >
        <Input
          type='text'
          value={email}
          placeholder={t('emailInput')}
          onChange={({ target: { value } }) => setEmail(value)}
          autoCapitalize='none'
          margin='0 0 1rem'
        />
        {passwordInput}
        <Wrapper width='100%' justifyContent='center' padding='0 1rem'>
          <Text
            fontSize='0.7rem'
            textDecoration='unset'
            onClick={() => setUsingMagicLink(!usingMagicLink)}
          >
            <span>{usingMagicLink ? t('usePassword') : t('useMagicLink')}</span>
          </Text>
        </Wrapper>
      </Wrapper>
      <Wrapper width='100%' justifyContent='center' alignItems='center'>
        {loading || magicLinkLoading ? (
          <LoadingIndicator />
        ) : (
          <Button
            variant='dark'
            onClick={() =>
              usingMagicLink ? handleMagicLink() : signUpWithEmailAndPassword()
            }
          >
            {usingMagicLink ? t('magicLinkButton') : t('signUpButton')}
          </Button>
        )}
      </Wrapper>
      <Wrapper width='100%' justifyContent='center' padding='0 1rem'>
        <Text fontSize='0.7rem' textDecoration='unset'>
          <span>{error}</span>
        </Text>
      </Wrapper>
      <Wrapper width='100%' justifyContent='center' padding='0 1rem'>
        <Text fontSize='0.7rem' textDecoration='unset'>
          <span>{success}</span>
        </Text>
      </Wrapper>
    </Wrapper>
  );
};

export default SignUpForm;
