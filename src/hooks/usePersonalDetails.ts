import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { UserCreatePayload, UserStruct } from "types/User";
import { useAPI } from "utils/api";

function usePersonalDetails(user: User | null): [UserStruct | null, () => void] {
    const [personalDetails, setpersonalDetails] = useState<UserStruct | null>(null);

    const onSuccess = useCallback((userDetails) => {
        setpersonalDetails(userDetails);
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
    }, user);

    useEffect(() => {
        if (user) {
            const { email, phoneNumber, displayName } = user;
            getUser({ email, phoneNumber, firstName: displayName, lastName: '' });
        }
    }, [user, getUser])

    return [personalDetails, getUser];
}

export default usePersonalDetails;
