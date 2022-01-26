import { useCallback } from 'react';
import { ProviderName } from 'types/Auth';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { ReactComponent as GoogleLogo } from 'assets/logos/svg/google.svg';
import { ReactComponent as FacebookLogo } from 'assets/logos/svg/facebook.svg';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import useFirebaseError from 'hooks/useFirebaseError';
import Button from 'components/Button';
import Wrapper from 'components/Wrapper';

interface SocialLoginProps {
  setLoading: (loading: boolean) => void,
  onSuccess: () => void
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  setLoading,
  onSuccess
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'socialLogin' });

  const auth = getAuth();
  const getFirebaseError = useFirebaseError();

  const handleSocialAuth = useCallback((providerName: ProviderName) => {
    setLoading(true);

    let provider = null;

    switch (providerName) {
      case ProviderName.Facebook:
        provider = new FacebookAuthProvider();
        break;
      case ProviderName.Google:
        provider = new GoogleAuthProvider();
        break;
      default:
        provider = new GoogleAuthProvider();
    }

    signInWithPopup(auth, provider)
      .then(() => {
        showToast({ message: t('signInToastMessage'), type: 'success' });
        onSuccess();
      })
      .catch((error) => {
        showToast({ message: getFirebaseError(error.code), type: 'error' });
      })
      .finally(() => setLoading(false))
  }, [auth, t, onSuccess, getFirebaseError, setLoading]);

  return (
    <Wrapper
      width='100%'
      direction='column'
      justifyContent='center'
      alignItems='center'
      gap='1rem'
      margin='2rem 0 0 0'
    >
      <Button
        variant='light'
        style={{ border: '0', color: '#000000' }}
        onClick={() => handleSocialAuth(ProviderName.Google)}
      >
        <GoogleLogo /> {t('googleButton')}
      </Button>
      <Button
        variant='light'
        style={{ border: '0', color: '#000000' }}
        onClick={() => handleSocialAuth(ProviderName.Google)}
      >
        <FacebookLogo /> {t('facebookButton')}
      </Button>
    </Wrapper>
  );
};

export default SocialLogin;
