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
  const { token } = useGlobal();
  const { method, endpoint, onSuccess, onError } = payload;

  // in some cases we will call the useAPI hook inside useGlobal
  // and in that case the user is not always up to date with global context state
  // Todo: It seems complicated maybe we should refine this in a later stage
  const tokenToUse = currentToken || token;

  const [loading, setLoading] = useState(false);

  const apiCall = useCallback(
    async (data?: T) => {
      let headers: HeadersInit = {
        'content-type': 'application/json',
      };

      let token = null;

      if (shouldUseToken) {
        token = tokenToUse;
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      };

      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/${endpoint}`, {
          method,
          headers,
          body: JSON.stringify(data),
        });

        if (res.status >= 200 && res.status < 400) {
          const response = await res.json();
          setLoading(false);
          onSuccess(response);
          return response;
        }
      } catch (e) {
        setLoading(false);
        onError(JSON.stringify(e));
      }
    },
    [tokenToUse, shouldUseToken, method, endpoint, onSuccess, onError]
  );

  return [apiCall, loading];
};
