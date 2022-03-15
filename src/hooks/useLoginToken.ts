import { useCallback, useState } from 'react';
import { useAPI } from 'utils/api';

const useLoginToken = (): [(email: string) => void, string | null, boolean] => {
    const [token, setToken] = useState<string | null>(null);
    const [existingUser, setExistingUser] = useState<boolean>(false);
    
    const onSuccess = useCallback((response) => {
        setToken(response.token)
        setExistingUser(response.existingUser)
    }, []);

    const [getCustomTokenAPI] = useAPI({
        method: 'POST',
        endpoint: 'auth/login-token',
        onError: () => {},
        onSuccess
    });

    const getToken = useCallback((
        email: string
    ) => {
        getCustomTokenAPI({
            email
        })
    }, [getCustomTokenAPI])

    return [getToken, token, existingUser]
}

export default useLoginToken
