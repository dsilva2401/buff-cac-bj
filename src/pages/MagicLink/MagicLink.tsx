import qs from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGlobal } from "context/global/GlobalContext";
import LoadingIndicator from "components/LoadingIndicator";
import useRedirectLoggedInUser from "hooks/useRedirectLoggedInUser";
import {
  User,
  getAuth,
  signInWithEmailLink,
  isSignInWithEmailLink,
} from "firebase/auth";

const MagicLink = () => {
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();

  const auth = getAuth();
  const location = useLocation();
  const { email } = qs.parse(location.search);
  const { signInRedirect } = useGlobal();

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
        });
    }
  }, [auth, email]);

  return <LoadingIndicator />;
};

export default MagicLink;
