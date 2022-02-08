import Button from 'components/Button';
import Input from 'components/Input';
import LoadingIndicator from 'components/LoadingIndicator';
import SocialLogin from 'components/SocialLogin';
import Text from 'components/Text';
import { showToast } from 'components/Toast/Toast';
import Wrapper from 'components/Wrapper';
import { useGlobal } from 'context/global/GlobalContext';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import useFirebaseError from 'hooks/useFirebaseError';
import useMagicLinkHandler from 'hooks/useMagicLinkHandler';
import { useCallback, useState } from 'react';
import { Animated } from 'react-animated-css';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface LoginFormProps {
  onLogin?: () => void;
  onForgotPasswordClick?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin = () => {},
  onForgotPasswordClick = () => {},
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

  // get magic link header
  const {
    handleMagicLink,
    loading: magicLinkLoading,
    error: magicLinkError,
    success,
  } = useMagicLinkHandler(username);

  const handleUsernameChanged = useCallback(
    ({ target: { value } }) => setUsername(value),
    []
  );

  const handleLogin = async () => {
    setLoading(true);
    if (error !== '') setError('');
    createUserWithEmailAndPassword(
      auth,
      username,
      process.env.DEFAULT_PASSWORD!
    )
      .then((data) => {
        console.log('data: ', data);
        onLogin();
        showToast({ message: t('signInToastMessage'), type: 'success' });
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
          height='auto'
        >
          <SocialLogin setLoading={setLoading} onSuccess={onLogin} />
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
          </Wrapper>
          <Wrapper width='100%' justifyContent='center' alignItems='center'>
            {loading || magicLinkLoading ? (
              <LoadingIndicator />
            ) : (
              <Button variant='dark' onClick={handleLogin}>
                {t('signInButton')}
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
