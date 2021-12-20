import { useGlobal } from "context/global/GlobalContext";
import { User } from "firebase/auth";
import { useCallback, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useAPI } from "utils/api";

const useRedirectLoggedInUser = (user?: User | null) => {
  const history = useHistory();

  const { signInRedirect, setSignInRedirect } = useGlobal();

  // create a copy of signInRedirect so it doesn't change when singInRedirect
  // sets to empty which will cause the redirection to occur again
  // We will fix this once the user will be in the global context

  const redirect = useRef<string>(signInRedirect);

  const onSuccess = useCallback(() => {
    let link = redirect.current || '/collection';

    if (redirect.current) {
      setSignInRedirect('');
    }

    history.push(link);
  }, [history, redirect, setSignInRedirect])

  const onError = useCallback((error) => {
    console.log('ERROR CODE: ', error.code);
    console.log('ERROR MSG: ', error.message);
  }, [])

  const [getUser] = useAPI<any>({
    method: 'POST',
    endpoint: 'auth',
    onSuccess,
    onError
  })

  useEffect(() => {
    if (user) {
      const { email, phoneNumber, displayName } = user;
      getUser({ email, phoneNumber, firstName: displayName, lastName: '' });
    }
  }, [user, getUser]);
};

export default useRedirectLoggedInUser;
