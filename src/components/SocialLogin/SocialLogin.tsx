import { ReactComponent as FacebookLogo } from 'assets/logos/svg/facebook.svg';
import { ReactComponent as GoogleLogo } from 'assets/logos/svg/google.svg';
import Button from 'components/Button';
import { showToast } from 'components/Toast/Toast';
import Wrapper from 'components/Wrapper';
import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import useFirebaseError from 'hooks/useFirebaseError';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ProviderName } from 'types/Auth';

interface SocialLoginProps {
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  isDrawer?: boolean;
  isHuman: boolean;
  buttonPrefix?: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  setLoading,
  onSuccess,
  isDrawer,
  isHuman,
  buttonPrefix,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'socialLogin' });

  const auth = getAuth();
  const getFirebaseError = useFirebaseError();

  const handleSocialAuth = useCallback(
    (providerName: ProviderName) => {
      if (!isHuman)
        showToast({
          message: 'Please complete Recpatcha verification',
          type: 'error',
        });
      else {
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
          .then((user) => {
            onSuccess();
          })
          .catch((error) => {
            showToast({
              message: getFirebaseError(error.code),
              type: 'error',
            });
          })
          .finally(() => setLoading(false));
      }
    },
    [auth, onSuccess, getFirebaseError, setLoading, isHuman]
  );

  return (
    <Wrapper
      width='100%'
      direction='column'
      justifyContent='center'
      alignItems='center'
      gap='0.5rem'
    >
      <Button
        variant='light'
        style={{ border: '0', color: '#000000' }}
        onClick={() => handleSocialAuth(ProviderName.Google)}
      >
        <GoogleLogo />
        {isDrawer ? `${buttonPrefix} with Google` : t('continueGoogleButton')}
      </Button>
      <Button
        variant='light'
        style={{ border: '0', color: '#000000' }}
        onClick={() => handleSocialAuth(ProviderName.Facebook)}
      >
        <FacebookLogo />
        {isDrawer
          ? `${buttonPrefix} with Facebook`
          : t('continueFacebookButton')}
      </Button>
    </Wrapper>
  );
};

export default SocialLogin;
