import LoadingIndicator from 'components/LoadingIndicator';
import PersonalDetails from 'components/PersonalDetails';
import { useGlobal } from 'context/global/GlobalContext';
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import qs from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { RoutesHashMap } from 'routes';

const MagicLink = () => {
  const { user, setUser, signInRedirect, setSignInRedirect } = useGlobal();
  const [showPersonalDetailsForm, togglePersonalDetailsForm] =
    useState<boolean>(false);

  const auth = getAuth();
  const location = useLocation();
  const history = useHistory();

  const { email, isNewUser } = qs.parse(location.search);

  const redirectUser = useCallback(() => {
    console.log('signInRedirect: ', signInRedirect);
    if (signInRedirect) {
      history.push(signInRedirect);
      setSignInRedirect('');
    } else {
      history.push(RoutesHashMap.Collection.path);
    }
  }, [setSignInRedirect, history, signInRedirect]);

  useEffect(() => {
    if (user) {
      // a string check: Variable embeded in query params defaults to string
      if (isNewUser === 'true') {
        togglePersonalDetailsForm(true);
        return;
      }

      // let link = signInRedirect || RoutesHashMap.Collection.path;
      // SUSH: Temp. change to route to collection. Need to undo and fix
      const link = RoutesHashMap.Collection.path;

      setSignInRedirect('');
      history.push(link);
    }
  }, [user, history, isNewUser, signInRedirect, setSignInRedirect]);

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
  }, [auth, email, setUser]);

  if (showPersonalDetailsForm) {
    return <PersonalDetails onPersonalDetailsUpdate={redirectUser} />;
  }

  return <LoadingIndicator />;
};

export default MagicLink;
