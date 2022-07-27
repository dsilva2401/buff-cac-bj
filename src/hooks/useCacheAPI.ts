import { useAPICacheContext } from 'context/APICacheContext/APICacheContext';
import { useAPI } from 'utils/api';

interface APIpayload {
  method: string;
  endpoint: string;
  onSuccess?: (response: any) => any;
  onError?: (error: string) => any;
}

const useCacheAPI = (
  payload: APIpayload,
  currentToken: string | null = null,
  shouldUseToken: boolean = true,
  cacheEnabled: boolean = false
) => {
  const { endpoint } = payload;

  const { getCacheForAPI } = useAPICacheContext();

  const [apiCall, ...restProps] = useAPI(
    payload,
    currentToken,
    shouldUseToken,
    cacheEnabled
  );

  const resolveCacheAndRequest = async () => {
    const cacheResponse = getCacheForAPI(endpoint);
    if (cacheResponse) {
      return cacheResponse;
    } else {
      return apiCall();
    }
  };

  return [resolveCacheAndRequest, ...restProps];
};

export default useCacheAPI;
