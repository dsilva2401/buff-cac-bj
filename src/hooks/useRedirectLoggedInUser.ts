import { useGlobal } from "context/global/GlobalContext";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useEffect, useRef } from "react";
import { User } from "firebase/auth";

const useRedirectLoggedInUser = (user?: User | null) => {
  const history = useHistory();
  const { t } = useTranslation("translation", { keyPrefix: "magicLink" });
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
