import { useGlobal } from "context/global/GlobalContext";
import { User } from "firebase/auth";
import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const useRedirectLoggedInUser = (
    token?: string,
    user?: User,
) => {
    const history = useHistory();

    const { signInRedirect, setSignInRedirect } = useGlobal();

    // create a copy of signInRedirect so it doesn't change when singInRedirect
    // sets to empty which will cause the redirection to occur again
    // We will fix this once the user will be in the global context

    const redirect = useRef<string>(signInRedirect);

    useEffect(() => {
        if (token) {
            console.log(token, 'token');

            let myHeaders = new Headers();
            myHeaders.append('Authorization', `Bearer ${token}`);
            myHeaders.append('Content-Type', 'application/json');

            let raw = JSON.stringify({
                email: user?.email,
                phoneNumber: user?.phoneNumber,
                firstName: user?.displayName,
                lastName: '',
            });

            fetch('https://damp-wave-40564.herokuapp.com/auth', {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
            })
            .then((response) => {
                if (response.status === 200) {
                    if (redirect.current) {
                        console.log('REDIRECT LINK: ', redirect.current);
                        setSignInRedirect('');
                        history.push(redirect.current);
                    } else history.push('/collection');
                }
            })
            .catch((error) => {
                console.log('ERROR CODE: ', error.code);
                console.log('ERROR MSG: ', error.message);
            });
        }
    }, [user, token, history, redirect.current]);
}

export default useRedirectLoggedInUser;
