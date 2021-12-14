import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { useCallback, useState } from "react";

interface MagicHandlerMap {
    handleMagicLink: () => void;
    loading: boolean;
    error: string;
    success: string;
}

const useMagicLinkHandler = (email: string): MagicHandlerMap => {
    const auth = getAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleMagicLink = useCallback(() => {
        const actionCodeSettings = {
            url: `http://localhost:3000/magic-link?email=${email}`,
            handleCodeInApp: true
        };

        setLoading(true);
        setError('');
        setSuccess('');

        sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => setSuccess('A magic link is sent to your email'))
            .catch(() => setError('An error occured'))
            .finally(() =>  setLoading(false));

    }, [email]);

    return {
        handleMagicLink, loading, error, success
    };
}

export default useMagicLinkHandler;
