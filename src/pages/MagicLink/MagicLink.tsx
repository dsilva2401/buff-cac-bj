import React, { useEffect, useState } from 'react';
import qs from 'query-string';
import { useLocation } from 'react-router-dom';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, User } from 'firebase/auth';
import LoadingIndicator from 'components/LoadingIndicator';
import useRedirectLoggedInUser from 'hooks/useRedirectLoggedInUser';
import { useGlobal } from 'context/global/GlobalContext';

const MagicLink = () => {
    const [user, setUser] = useState<User | undefined>();
    const [token, setToken] = useState<string | undefined>();
    const { signInRedirect }  = useGlobal();

    const location = useLocation();
    const { email } = qs.parse(location.search);

    const auth = getAuth();

    useRedirectLoggedInUser(token, user, signInRedirect);

    useEffect(() => {
        async function fetchData() {
          const token = await user?.getIdToken();
          setToken(token);
        }
        if (user) fetchData();
      }, [user]);

    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            signInWithEmailLink(auth, email as string, window.location.href)
                .then((userCredentials) => {
                    setUser(userCredentials.user);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }, [email]);

    return (
        <LoadingIndicator />
    );
};

export default MagicLink;
