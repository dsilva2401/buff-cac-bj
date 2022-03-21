import { useAPI } from 'utils/api';

const useLoginToken = (
  onSuccess: (data?: any) => void
): [(data?: unknown) => Promise<any>] => {
  const [getCustomTokenAPI] = useAPI({
    method: 'POST',
    endpoint: 'auth/login-token',
    onError: () => {},
    onSuccess,
  });

  return [getCustomTokenAPI];
};

export default useLoginToken;
