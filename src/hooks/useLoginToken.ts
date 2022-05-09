import { showToast } from 'components/Toast/Toast';
import { useCallback } from 'react';
import { useAPI } from 'utils/api';

const useLoginToken = (
  onSuccess: (data?: any) => void
): [(data?: unknown) => Promise<any>] => {
  const onError = useCallback((response) => {
    showToast({ type: 'error', message: response.error });
  }, []);

  const [getCustomTokenAPI] = useAPI({
    method: 'POST',
    endpoint: 'auth/login-token',
    onError: onError,
    onSuccess,
  });

  return [getCustomTokenAPI];
};

export default useLoginToken;
