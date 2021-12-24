import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import LoadingIndicator from "components/LoadingIndicator";
import {
  getAuth,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from "firebase/auth";
import { useGlobal } from "context/global/GlobalContext";
import PersonalDetails from "components/PersonalDetails";

const MagicLink = () => {
  const { user, setUser, signInRedirect, setSignInRedirect } = useGlobal();
  const [ showPersonalDetailsForm, togglePersonalDetailsForm ] = useState<boolean>(false);

  const auth = getAuth();
  const location = useLocation();
  const history = useHistory();

  const { email, isNewUser } = qs.parse(location.search);

  const redirectUser = useCallback(() => {
    if (signInRedirect) {
      history.push(signInRedirect)
      setSignInRedirect('');
    } else {
      history.push('/collection')
    }
  }, [setSignInRedirect, history, signInRedirect]);

  useEffect(() => {
    if (user) {

      // a string check: Variable embeded in query params defaults to string
      if (isNewUser === 'true') {
        togglePersonalDetailsForm(true);
        return;
      }

      let link = signInRedirect || '/collection';

      setSignInRedirect('');
      history.push(link);
    }
  }, [user, history, isNewUser, signInRedirect])

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

  if (showPersonalDetailsForm) {
    return <
      PersonalDetails
      onPersonalDetailsUpdate={redirectUser}
    />
  }

  return <LoadingIndicator />;
};

export default MagicLink;
