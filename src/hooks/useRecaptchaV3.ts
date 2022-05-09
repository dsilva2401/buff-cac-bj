import { useCallback, useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAPI } from 'utils/api';

const RECAPTCHA_HUMAN_THRESHOLD = 0.5;

const useRecaptchaV3 = () => {
  const [isVerified, setVerified] = useState<boolean>(true);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const onRecaptchaSuccess = useCallback((response) => {
    if (response.score < RECAPTCHA_HUMAN_THRESHOLD) {
      setVerified(false);
    }
  }, []);

  const onError = useCallback(() => {}, []);

  const [verifyCaptcha] = useAPI({
    endpoint: 'auth/verify-captcha',
    method: 'POST',
    onSuccess: onRecaptchaSuccess,
    onError: onError,
  });

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) return;

    const captchaToken = await executeRecaptcha();

    if (captchaToken) {
      verifyCaptcha({ token: captchaToken });
    }
  }, [executeRecaptcha, verifyCaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  return isVerified;
};

export default useRecaptchaV3;
