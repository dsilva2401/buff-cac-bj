import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { UserCreatePayload, UserStruct } from "types/User";
import { useAPI } from "utils/api";

function usePersonDetails(user: User | null) {
    const [personalDetails, setPersonDetails] = useState<UserStruct | null>(null);

    const onSuccess = useCallback((userDetails) => {
        setPersonDetails(userDetails);
    }, [])
    
    const onError = useCallback((error) => {
        console.log('ERROR CODE: ', error.code);
        console.log('ERROR MSG: ', error.message);
    }, [])

    const [getUser] = useAPI<UserCreatePayload>({
        method: 'POST',
        endpoint: 'auth',
        onSuccess,
        onError
    }, user)

    useEffect(() => {
        if (user) {
            const { email, phoneNumber, displayName } = user;
            console.log(email, phoneNumber, displayName, 'email, phoneNumber, displayName')
            getUser({ email, phoneNumber, firstName: displayName, lastName: '' });
        }
    }, [user, getUser])

    return personalDetails;
}

export default usePersonDetails;
