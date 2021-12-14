import brijLogo from 'assets/logos/svg/brij-colored.svg';
import { ReactComponent as FacebookLogo } from 'assets/logos/svg/facebook.svg';
import { ReactComponent as GoogleLogo } from 'assets/logos/svg/google.svg';
import Button from 'components/Button';
import Image from 'components/Image';
import Input from 'components/Input';
import LoadingIndicator from 'components/LoadingIndicator';
import PageFooter from 'components/PageFooter';
import PageHeader from 'components/PageHeader';
import Text from 'components/Text';
import Wrapper from 'components/Wrapper';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useGlobal } from '../../context/global/GlobalContext';

const Login: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });
  const { signInRedirect, pageState } = useGlobal();
  const history = useHistory();
  const auth = getAuth();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<string>(signInRedirect || '');
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | undefined>('');
  const [user, setUser] = useState<User | undefined>(undefined);

  console.log('GLOBAL PAGE STATE: ', pageState);
  console.log('GLOBAL REDIRECT STATE: ', signInRedirect);

  const handleGoogleAuth = useCallback(() => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => {
        console.log('ERROR CODE: ', error.code);
        console.log('ERROR MSG: ', error.message);
        // // The email of the user's account used.
        // const email = error.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }, [auth]);

  const handleFacebookAuth = useCallback(() => {
    history.push('/collection');
  }, [history]);

  const handleUsernameChanged = useCallback(
    ({ target: { value } }) => setUsername(value),
    []
  );

  const handlePasswordChanged = useCallback(
    ({ target: { value } }) => setPassword(value),
    []
  );

  const logo = useMemo(
    () => <Image width='auto' src={brijLogo} alt='Brij logo' />,
    []
  );

  useEffect(() => {
    async function fetchData() {
      const token = await user?.getIdToken();
      setToken(token);
    }
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (token) {
      let myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);
      myHeaders.append('Content-Type', 'application/json');

      let raw = JSON.stringify({
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        firstName: user?.displayName,
        lastName: '',
      });

      fetch('https://damp-wave-40564.herokuapp.com/auth', {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      })
        .then((response) => {
          if (response.status === 200) {
            if (redirect) {
              console.log('REDIRECT LINK: ', redirect);
              history.push(redirect);
            } else history.push('/collection');
          }
        })
        .catch((error) => {
          console.log('ERROR CODE: ', error.code);
          console.log('ERROR MSG: ', error.message);
        });
      setLoading(false);
    }
  }, [user, token, history, redirect]);

  const handleLogin = () => {
    setLoading(true);
    if (error !== '') setError('');
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        console.log('ERROR CODE: ', error.code);
        console.log('ERROR MSG: ', error.message);
        setLoading(false);
      });
  };

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='space-between'
      alignItems='center'
    >
      <PageHeader border title={t('pageHeaderTitle')} logo={logo} />
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='flex-start'
        alignItems='center'
        padding='2rem 1rem'
        gap='1.2rem'
        overflow='auto'
      >
        <Wrapper
          width='100%'
          direction='column'
          justifyContent='center'
          alignItems='center'
          gap='1rem'
        >
          <Button theme='light' onClick={handleGoogleAuth}>
            <GoogleLogo /> {t('googleButton')}
          </Button>
          <Button theme='light' onClick={handleFacebookAuth}>
            <FacebookLogo /> {t('facebookButton')}
          </Button>
        </Wrapper>

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
            margin='0 0 1rem'
          />
          <Input
            type='password'
            value={password}
            placeholder={t('passwordInput')}
            onChange={handlePasswordChanged}
          />
          <Wrapper width='100%' justifyContent='flex-end' padding='0 1rem'>
            <Text fontSize='0.7rem' textDecoration='unset'>
              <Link to='/forgot-password'>{t('forgotPassword')}</Link>
            </Text>
          </Wrapper>
        </Wrapper>
        <Wrapper width='100%' justifyContent='center' alignItems='center'>
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Button theme='dark' onClick={() => handleLogin()}>
              {t('signInButton')}
            </Button>
          )}
        </Wrapper>
      </Wrapper>
      <PageFooter>
        <p>{t('newToBrij')}?</p>
        <Link to={'/signup'}>{t('signUpLink')}</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default Login;
