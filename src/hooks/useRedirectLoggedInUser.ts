import { useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { RoutesHashMap } from 'routes';
import { useHistory } from 'react-router-dom';
import { useGlobal } from 'context/global/GlobalContext';

const useRedirectLoggedInUser = (
  user?: User | null,
  isNewEmailUser?: boolean
) => {
  const history = useHistory();
  const { signInRedirect, setSignInRedirect } = useGlobal();

  // create a copy of signInRedirect so it doesn't change when singInRedirect
  // sets to empty which will cause the redirection to occur again
  // We will fix this once the user will be in the global context

  const redirect = useRef<string>(signInRedirect);

  useEffect(() => {
    if (user) {
      if (isNewEmailUser) {
        history.push(RoutesHashMap.PersonalDetails.path);
        return;
      }

      let link = redirect.current || RoutesHashMap.Collection.path;

      if (redirect.current) {
        setSignInRedirect('');
      }

      history.push(link);
    }
  }, [user, history, redirect, setSignInRedirect, isNewEmailUser]);
};

export default useRedirectLoggedInUser;
