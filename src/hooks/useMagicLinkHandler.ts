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
    setLoading(true);
    setError('');
    setSuccess('');
    fetch(
      `${process.env.REACT_APP_API_URL || ''}/shared-api/auth/send-magic-link`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          isNewUser: isNewUser,
          magicAction: magicAction,
          slug: slug,
          host: window.location.host,
          payloadEncodedString: payloadEncodedString,
        }),
      }
    )
      .then(() => {
        setLoading(false);
        showToast({
          message: t('linkSentToastMessage'),
          type: 'success',
        });
      })
      .catch((err) => {
        setLoading(false);
        showToast({ message: getErrorMessage(err.code), type: 'error' });
      });
  }, [
    t,
    slug,
    auth,
    email,
    isNewUser,
    getErrorMessage,
    magicPayload,
    magicAction,
  ]);

  return {
    handleMagicLink,
    loading,
    error,
    success,
  };
};

export default useMagicLinkHandler;
