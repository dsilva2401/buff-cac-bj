import { showToast } from 'components/Toast/Toast';
import { useGlobal } from 'context/global/GlobalContext';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFirebaseError from './useFirebaseError';

interface MagicHandlerMap {
  handleMagicLink: () => void;
  loading: boolean;
  error: string;
  success: string;
}

const useMagicLinkHandler = (
  email: string,
  isNewUser: boolean = false
): MagicHandlerMap => {
  const auth = getAuth();
  const { magicAction, slug, magicPayload } = useGlobal();
  const { t } = useTranslation('translation', { keyPrefix: 'magicLink' });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const getErrorMessage = useFirebaseError();

  const handleMagicLink = useCallback(() => {
    const payload = JSON.stringify(magicPayload);
    const payloadEncodedString = encodeURIComponent(payload);

    const actionCodeSettings = {
      url: `${window.location.protocol}//${window.location.host}/app/magic-link?email=${email}&isNewUser=${isNewUser}&action=${magicAction}&productSlug=${slug}&payload=${payloadEncodedString}`,
      handleCodeInApp: true,
    };

    setLoading(true);
    setError('');
    setSuccess('');

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then((data) =>
        showToast({
          message:
            'You already have an account with Brij. please try to log in with a third-party vendor.',
          type: 'error',
        })
      )
      .catch((error) =>
        showToast({ message: getErrorMessage(error.code), type: 'error' })
      )
      .finally(() => setLoading(false));
  }, [email, auth, isNewUser, t, getErrorMessage, magicAction, magicPayload]);

  return {
    handleMagicLink,
    loading,
    error,
    success,
  };
};

export default useMagicLinkHandler;
