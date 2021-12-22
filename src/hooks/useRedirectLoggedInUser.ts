import { useGlobal } from "context/global/GlobalContext";
import { User } from "firebase/auth";
import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const useRedirectLoggedInUser = (user?: User | null) => {
  const history = useHistory();

  const { signInRedirect, setSignInRedirect } = useGlobal();

  // create a copy of signInRedirect so it doesn't change when singInRedirect
  // sets to empty which will cause the redirection to occur again
  // We will fix this once the user will be in the global context

  const redirect = useRef<string>(signInRedirect);

  useEffect(() => {
    if (user) {
      let link = redirect.current || '/collection';

      if (redirect.current) {
        setSignInRedirect('');
      }

      history.push(link);
    }
  }, [user, history, redirect, setSignInRedirect]);
};

export default useRedirectLoggedInUser;
