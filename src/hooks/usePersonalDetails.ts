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
  const [shouldRemoveUpdate, setShouldRemoveUpdate] = useState<boolean>(false);
  const userFormUpdateId = localStorage.getItem('brij-form-user-update-id');

  const [updateForm] = useAPI<{ user: string }>({
    method: 'PUT',
    endpoint: `form/form_answers/${userFormUpdateId}`,
    onSuccess: () => {
      if (shouldRemoveUpdate) {
        localStorage.removeItem('brij-form-user-update-id');
      }
    },
    onError: () => {},
  });

  const onSuccess = useCallback(
    (userDetails: UserStruct) => {
      setpersonalDetails(userDetails);
      if (userFormUpdateId) {
        // phone number is optional so let's check everything
        // check everything because oauth may not have same validation rules as us.
        // update form with user name on init then update if first, last, phone is there
        if (
          userDetails.profile.firstName ||
          userDetails.profile.lastName ||
          userDetails.profile.phoneNumber
        ) {
          setShouldRemoveUpdate(true);
        }
        updateForm({ user: userDetails._id });
      }
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
