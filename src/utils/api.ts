import { useGlobal } from "context/global/GlobalContext";
import { User } from "firebase/auth";
import { useCallback, useState } from "react";

// const API_URL = 'https://damp-wave-40564.herokuapp.com';
const API_URL = 'http://localhost:3000';
interface APIpayload {
  method: string,
  endpoint: string,
  onSuccess: (response: any) => any,
  onError: (error: string) => any,
}

type UseAPIVars<T> = [
  (data?: T) => Promise<any>,
  boolean
]

export function useAPI<T>(
  payload: APIpayload,
  currentUser: User | null = null,
  shouldUseToken: boolean = true
): UseAPIVars<T> {
  const { user } = useGlobal();
  const { method, endpoint, onSuccess, onError } = payload;

  // in some cases we will call the useAPI hook inside useGlobal
  // and in that case the user is not always up to date with global context state
  // Todo: It seems complicated maybe we should refine this in a later stage
  const userToUse = currentUser || user;

  const [loading, setLoading] = useState(false);

  const apiCall = useCallback(
    async (data?: T) => {
      let headers: HeadersInit = {
        'content-type': 'application/json'
      };

      let token = null;

      if (shouldUseToken) {
        token = await userToUse?.getIdToken();
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/${endpoint}`,
          {
            method,
            headers,
            body: JSON.stringify(data),
          }
        );

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
    [userToUse, shouldUseToken, method, endpoint, onSuccess, onError]
  )

  return [apiCall, loading];
}