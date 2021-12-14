import { User } from "firebase/auth";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useRedirectLoggedInUser = (
    token?: string,
    user?: User,
    redirect?: string,
) => {
    const history = useHistory();

    useEffect(() => {
        if (token) {
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
                    if (redirect) {
                        console.log('REDIRECT LINK: ', redirect);
                        history.push(redirect);
                    } else history.push('/collection');
                }
            })
            .catch((error) => {
                console.log('ERROR CODE: ', error.code);
                console.log('ERROR MSG: ', error.message);
            });
        }
    }, [user, token, history, redirect]);
}

export default useRedirectLoggedInUser;
