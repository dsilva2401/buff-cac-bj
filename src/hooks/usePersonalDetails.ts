import { useCallback, useEffect, useState } from 'react';
import { UserCreatePayload, UserStruct } from 'types/User';
import { User } from 'firebase/auth';
import { useAPI } from 'utils/api';

function usePersonalDetails(
  user: User | null
): [UserStruct | null, () => void] {
  const [personalDetails, setpersonalDetails] = useState<UserStruct | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);

  const onSuccess = useCallback((userDetails) => {
    setpersonalDetails(userDetails);
  }, []);

  const onError = useCallback((error) => {
    console.log('ERROR CODE: ', error.code);
    console.log('ERROR MSG: ', error.message);
  }, []);

  const [getUser] = useAPI<UserCreatePayload>(
    {
      method: 'POST',
      endpoint: 'auth',
      onSuccess,
      onError,
    },
    token
  );

  useEffect(() => {
    if (user && !token) {
      const setUserToken = async () => {
        const tokenExtracted = (await user?.getIdToken()) || null;
        setToken(tokenExtracted);
      };

      setUserToken();
    }
  }, [user, token]);

  useEffect(() => {
    if (user && token) {
      const { email, phoneNumber, displayName } = user;
      getUser({ email, phoneNumber, firstName: displayName, lastName: '' });
    }
  }, [user, getUser, token]);

  return [personalDetails, getUser];
}

export default usePersonalDetails;
