import { useCallback, useState } from 'react';
import { Animated } from 'react-animated-css';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { showToast } from 'components/Toast/Toast';
import { useGlobal } from 'context/global/GlobalContext';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import LoadingIndicator from 'components/LoadingIndicator';
import useMagicLinkHandler from 'hooks/useMagicLinkHandler';
import useFirebaseError from 'hooks/useFirebaseError';
import SocialLogin from 'components/SocialLogin';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';

interface LoginFormProps {
  onLogin?: () => void;
  onForgotPasswordClick?: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin = () => { },
  onForgotPasswordClick = () => { }
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });
  const getErrorMessage = useFirebaseError();
  const { retractDrawer } = useGlobal();
  const location = useLocation();
  const auth = getAuth();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [usingMagicLink, setUsingMagicLink] = useState<boolean>(true);

  // get magic link header
  const {
    handleMagicLink,
    loading: magicLinkLoading,
    error: magicLinkError,
    success
  } = useMagicLinkHandler(username);

  const handleUsernameChanged = useCallback(
    ({ target: { value } }) => setUsername(value),
    []
  );

  const handlePasswordChanged = useCallback(
    ({ target: { value } }) => setPassword(value),
    []
  );

  const handleLogin = () => {
    setLoading(true);
    if (error !== '') setError('');
    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        onLogin();
        showToast({ message: t('signInToastMessage'), type: 'success' });
      })
      .catch((error) => {
        showToast({ message: getErrorMessage(error.code), type: 'error' });
        setLoading(false);
      })
      .finally(() => setLoading(false))
  };

  const passwordInput = (
    !usingMagicLink ? (
      <Input
        type='password'
        value={password}
        margin='0 0 1rem'
        autoCapitalize='none'
        placeholder={t('passwordInput')}
        onChange={handlePasswordChanged}
      />
    ) : null
  );

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      overflow='hidden'
    >
      <Animated
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={location.pathname === '/' ? 0 : 300}
        animationOutDuration={location.pathname === '/' ? 0 : 300}
        animationInDelay={location.pathname !== '/' && retractDrawer ? 200 : 0}
        animateOnMount
        isVisible={true}
        style={{ width: '100%' }}
      >
        <Wrapper
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          padding='2rem 1rem'
          overflow='hidden'
          gap='1.2rem'
        >
          <SocialLogin
            setLoading={setLoading}
            onSuccess={onLogin}
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
              value={username}
              placeholder={t('emailInput')}
              onChange={handleUsernameChanged}
              autoCapitalize='none'
              margin='0 0 1rem'
            />
            {passwordInput}
            <Wrapper width='100%' justifyContent='space-between' padding='0 1rem'>
              <Text
                fontSize='0.7rem'
                textDecoration='unset'
                onClick={() => setUsingMagicLink(!usingMagicLink)}
              >
                <span>{usingMagicLink ? t('usePassword') : t('useMagicLink')}</span>
              </Text>
              <Text fontSize='0.7rem' textDecoration='unset' onClick={() => onForgotPasswordClick()}>
                <span>
                  {t('forgotPassword')}
                </span>
              </Text>
            </Wrapper>
          </Wrapper>
          <Wrapper width='100%' justifyContent='center' alignItems='center'>
            {loading || magicLinkLoading ? (
              <LoadingIndicator />
            ) : (
              <Button
                variant='dark'
                disabled={usingMagicLink ? !username : !username || !password}
                onClick={() => (usingMagicLink ? handleMagicLink() : handleLogin())}
              >
                {usingMagicLink ? t('magicLinkButton') : t('signInButton')}
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
