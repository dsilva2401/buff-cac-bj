import { useCallback, useEffect, useState } from 'react';
import { UserCreatePayload, UserStruct } from 'types/User';
import { User } from 'firebase/auth';
import { useAPI } from 'utils/api';

function usePersonalDetails(
  user: User | null
): [
  UserStruct | null,
  () => void,
  string | null,
  (newToken: string | null) => void
] {
  const [personalDetails, setpersonalDetails] = useState<UserStruct | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);
  const [tempToken, setTempToken] = useState<string | null>(null);

  const onSuccess = useCallback(
    (userDetails) => {
      setpersonalDetails(userDetails);

      // set the real token so all the API's can use it.
      setToken(tempToken);
    },
    [tempToken]
  );

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
    tempToken
  );

  useEffect(() => {
    // if user doesn't exist remove token ( mostly triggered when user logs out)
    if (!user) {
      setToken(null);
      setTempToken(null);
      return;
    }

    if (user && !tempToken) {
      const setUserToken = async () => {
        const tokenExtracted = (await user?.getIdToken()) || null;
        setTempToken(tokenExtracted);
      };

      setUserToken();
    }
  }, [user, tempToken]);

  useEffect(() => {
    if (user && tempToken) {
      const { email, phoneNumber, displayName } = user;
      getUser({ email, phoneNumber, firstName: displayName, lastName: '' });
    }
  }, [user, getUser, tempToken]);

  return [personalDetails, getUser, token, setToken];
}

export default usePersonalDetails;
