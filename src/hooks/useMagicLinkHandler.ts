import { showToast } from 'components/Toast/Toast';
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
  const { t } = useTranslation('translation', { keyPrefix: 'magicLink' });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const getErrorMessage = useFirebaseError();

  const handleMagicLink = useCallback(() => {
    const actionCodeSettings = {
      url: `${window.location.protocol}//${window.location.host}/magic-link?email=${email}&isNewUser=${isNewUser}`,
      handleCodeInApp: true,
    };

    setLoading(true);
    setError('');
    setSuccess('');

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then((data) =>
        showToast({
          message: 'You already have an account with Brij. please try to log in with a third-party vendor.',
          type: 'error',
        })
      )
      .catch((error) =>
        showToast({ message: getErrorMessage(error.code), type: 'error' })
      )
      .finally(() => setLoading(false));
  }, [email, auth, isNewUser, t, getErrorMessage]);

  return {
    handleMagicLink,
    loading,
    error,
    success,
  };
};

export default useMagicLinkHandler;
