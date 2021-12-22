import qs from "query-string";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import LoadingIndicator from "components/LoadingIndicator";
import {
  getAuth,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from "firebase/auth";
import { useGlobal } from "context/global/GlobalContext";

const MagicLink = () => {
  const { user, setUser, signInRedirect } = useGlobal();

  const auth = getAuth();
  const location = useLocation();
  const history = useHistory();

  const { email, isNewUser } = qs.parse(location.search);

  useEffect(() => {
    if (user) {
      let link = signInRedirect || '/collection';

      if (isNewUser === 'true') {
        link = '/personal-details'
      }

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

  return <LoadingIndicator />;
};

export default MagicLink;
