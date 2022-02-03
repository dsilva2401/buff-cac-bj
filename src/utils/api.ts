import { useGlobal } from 'context/global/GlobalContext';
import { useCallback, useState } from 'react';

interface APIpayload {
  method: string;
  endpoint: string;
  onSuccess: (response: any) => any;
  onError: (error: string) => any;
}

type UseAPIVars<T> = [(data?: T) => Promise<any>, boolean];

// In dev mode, pass REACT_APP_API_URL manually. In production mode, this will be null as this code will be served from same host
const API_URL =
  process.env.NODE_ENV === 'development' ? process.env.REACT_APP_API_URL : '';

export function useAPI<T>(
  payload: APIpayload,
  currentToken: string | null = null,
  shouldUseToken: boolean = true
): UseAPIVars<T> {
  const { token, isPreviewMode } = useGlobal();
  const { method, endpoint, onSuccess, onError } = payload;

  // in some cases we will call the useAPI hook inside useGlobal
  // and in that case the user is not always up to date with global context state
  // Todo: It seems complicated maybe we should refine this in a later stage
  const tokenToUse = currentToken || token;

  const [loading, setLoading] = useState(false);

  const apiCall = useCallback(
    async (data?: T) => {
      if (
        method === 'GET' &&
        endpoint.includes('products') &&
        !endpoint.includes('products/collection')
      ) {
        const slug = endpoint.split('/')[1];
        if (slug === '1234') {
          // Slug 1234 is special case of preview mode
          // data will be sent via iframe message
          return;
        }
      }
      let headers: HeadersInit = {
        'content-type': 'application/json',
      };

      let token = null;

      if (shouldUseToken) {
        token = tokenToUse;
      }
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/app_api/${endpoint}`, {
          method,
          headers,
          body: JSON.stringify(data),
        });

        if (res.status >= 200 && res.status < 400) {
          const response = await res.json();
          setLoading(false);
          onSuccess(response);
          return response;
        } else if (res.status === 400 && !isPreviewMode) {
          window.location.pathname = '/404';
        }
      } catch (e) {
        setLoading(false);
        onError(JSON.stringify(e));
      }
    },
    [
      tokenToUse,
      shouldUseToken,
      method,
      endpoint,
      onSuccess,
      onError,
      isPreviewMode,
    ]
  );

  return [apiCall, loading];
}
