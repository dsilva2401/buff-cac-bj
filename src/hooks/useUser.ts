import { getAuth, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import usePersonalDetails from './usePersonalDetails';

const useUser = () => {
  const [authFetched, setAuthFetched] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [personalDetails, getPersonalDetails, token, setToken] =
    usePersonalDetails(user);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setAuthFetched(true);
      }
    });
  }, [setAuthFetched, setUser]);

  useEffect(() => {
    if (personalDetails && token) setAuthFetched(true);
  }, [personalDetails, token]);

  return {
    user,
    setUser,
    personalDetails,
    getPersonalDetails,
    authFetched,
    token,
    setToken,
  };
};

export default useUser;
