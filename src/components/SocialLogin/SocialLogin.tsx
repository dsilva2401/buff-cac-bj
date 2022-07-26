import { ReactComponent as FacebookLogo } from 'assets/logos/svg/facebook.svg';
import { ReactComponent as GoogleLogo } from 'assets/logos/svg/google.svg';
import Button from 'components/Button';
import Wrapper from 'components/Wrapper';
import {
  getAuth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithRedirect,
} from 'firebase/auth';
import { usePreview } from 'hooks/usePreview';
import { useCallback } from 'react';
import { ProviderName } from 'types/Auth';
import { useTranslation } from 'react-i18next';
import { useGlobal } from '../../context/global/GlobalContext';

interface SocialLoginProps {
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
  isDrawer?: boolean;
  buttonPrefix?: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  setLoading,
  onSuccess,
  isDrawer,
  buttonPrefix,
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'socialLogin' });

  const auth = getAuth();
  const { productModule } = useGlobal();
  const { isPreviewMode, showSuccessPreviewDrawer } = usePreview();

  const handleSocialAuth = useCallback(
    async (providerName: ProviderName) => {
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

      // Only set these if the user is going to be redirect to the slug
      if (isDrawer) {
        localStorage.setItem('registringProduct', 'true');
        localStorage.setItem('currentProductModuleId', productModule);
      }
      await signInWithRedirect(auth, provider);
    },
    [auth, onSuccess, setLoading, productModule, isPreviewMode]
  );

  return (
    <Wrapper
      width='100%'
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      <Button
        className='register-btn google'
        variant='light'
        margin='0.5rem 0'
        onClick={() =>
          isPreviewMode
            ? showSuccessPreviewDrawer()
            : handleSocialAuth(ProviderName.Google)
        }
        style={{ border: '1px solid #636369', color: '#000000' }}
      >
        <GoogleLogo />
        {isDrawer
          ? `${buttonPrefix} ${t('withGoogleText')}`
          : t('continueGoogleButton')}
      </Button>
      <Button
        className='register-btn facebook'
        variant='light'
        onClick={() =>
          isPreviewMode
            ? showSuccessPreviewDrawer()
            : handleSocialAuth(ProviderName.Facebook)
        }
        style={{ border: '1px solid #636369', color: '#000000' }}
      >
        <FacebookLogo />
        {isDrawer
          ? `${buttonPrefix} ${t('withFacebooktext')}`
          : t('continueFacebookButton')}
      </Button>
    </Wrapper>
  );
};

export default SocialLogin;
