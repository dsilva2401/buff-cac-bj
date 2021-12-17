import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import LoadingIndicator from "components/LoadingIndicator";
import {
  getAuth,
  signInWithEmailLink,
  isSignInWithEmailLink,
  User,
} from "firebase/auth";
import { useAPI } from "utils/api";
import { useGlobal } from "context/global/GlobalContext";

interface UserCreatePayload {
  email: string | null,
  phoneNumber: string | null,
  firstName: string | null,
  lastName: string | null,
  tag?: string
}

const MagicLink = () => {
  const { user, setUser, signInRedirect } = useGlobal();

  const auth = getAuth();
  const location = useLocation();
  const history = useHistory();

  const { email, isNewUser } = qs.parse(location.search);

  const onSuccess = useCallback(() => {
    let link = signInRedirect || '/collection';

    if (isNewUser === 'true') {
      link = '/personal-details'
    }

    history.push(link);
  }, [history, signInRedirect])

  const onError = useCallback((error) => {
    console.log('ERROR CODE: ', error.code);
    console.log('ERROR MSG: ', error.message);
  }, [])

  const [getUser] = useAPI<UserCreatePayload>({
    method: 'POST',
    endpoint: 'auth',
    onSuccess,
    onError
  })

  useEffect(() => {
    if (user) {
      const { email, phoneNumber, displayName } = user;
      console.log(email, phoneNumber, displayName, 'email, phoneNumber, displayName')
      getUser({ email, phoneNumber, firstName: displayName, lastName: '' });
    }
  }, [user, getUser])

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email as string, window.location.href)
        .then((userCredentials) => {
          setUser(userCredentials.user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [auth, email]);

  return <LoadingIndicator />;
};

export default MagicLink;
