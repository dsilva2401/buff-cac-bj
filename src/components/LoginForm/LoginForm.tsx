import React, { useState, useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import { RoutesHashMap } from 'routes';
import { Animated } from 'react-animated-css';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { getRegisterText } from 'utils/getRegisterText';
import { useGlobal } from 'context/global/GlobalContext';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { ReactComponent as EmailLogo } from 'assets/logos/svg/email.svg';
import { ReactComponent as EmailLogoAlternate } from 'assets/logos/svg/email-alternate.svg';
import useMagicLinkHandler from 'hooks/useMagicLinkHandler';
import LoadingIndicator from 'components/LoadingIndicator';
import PersonalDetails from 'components/PersonalDetails';
import useFirebaseError from 'hooks/useFirebaseError';
import useRecaptchaV3 from 'hooks/useRecaptchaV3';
import useElementSize from 'hooks/useElementSize';
import SocialLogin from 'components/SocialLogin';
import useLoginToken from 'hooks/useLoginToken';
import EditInput from 'components/EditInput';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Text from 'components/Text';
import validator from 'validator';
interface LoginFormProps {
  isDrawer?: boolean;
  onLogin?: (isNewUser?: boolean) => void;
  onPersonalDetails?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin = () => {},
  isDrawer,
}) => {
  const [emailRegistration, toggleEmailRegistration] = useState<boolean>(false);
  const [emailValidated, setEmailValidated] = useState<boolean>(false);
  const [showRecaptcha, setShowRecaptcha] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isHuman, setHuman] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [showPersonalDetailsForm, togglePersonalDetailsForm] =
    useState<boolean>(false);

  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });
  const { retractDrawer, brandTheme, productDetails, isPreviewMode } =
    useGlobal();
  const [inputWrapperRef, { width }] = useElementSize();
  const isVerified = useRecaptchaV3();
  const getErrorMessage = useFirebaseError();
  const location = useLocation();
  const auth = getAuth();

  // sync isVerified with isHuman
  useEffect(() => {
    // if user is not verified show backup recaptcha
    if (!isVerified) {
      setShowRecaptcha(true);
    }

    setHuman(isVerified);
  }, [isVerified]);

  useEffect(() => {
    if (!emailValidated) setEmailSent(false);
  }, [emailValidated]);

  const registrationType = productDetails?.registration?.registrationType;

  // get magic link header
  const {
    handleMagicLink,
    loading: magicLinkLoading,
    error: magicLinkError,
    success,
  } = useMagicLinkHandler(username);

  const validateEmail = useCallback((value: string) => {
    if (validator.isEmail(value)) setEmailValidated(true);
    else setEmailValidated(false);
  }, []);

  const handleUsernameChanged = (value: string) => {
    setUsername(value.trim());
    validateEmail(value.trim());
  };

  const onSuccess = useCallback(
    (response: any) => {
      if (response.existingUser) {
        setLoading(false);
        return handleMagicLink();
      } else if (response.token) {
        signInWithCustomToken(auth, response.token)
          .then(() => {
            if (!isDrawer) {
              togglePersonalDetailsForm(true);
            } else {
              onLogin(true);
            }
          })
          .catch((error) => {
            showToast({ message: getErrorMessage(error.code), type: 'error' });
          })
          .finally(() => setLoading(false));
      }
    },
    [handleMagicLink, auth, isDrawer, onLogin, getErrorMessage]
  );

  const [getToken] = useLoginToken(onSuccess);

  const onRecaptchaSuccess = useCallback(() => {
    setHuman(true);
    // dismiss all toast
    toast.dismiss();
  }, []);

  const handleLogin = useCallback(async () => {
    if (!isHuman) {
      showToast({
        message: 'Please complete Recpatcha verification',
        type: 'error',
      });
      return;
    } else if (!emailValidated) {
      showToast({ type: 'error', message: 'Invalid Email' });
      return;
    } else {
      setLoading(true);
      if (isPreviewMode) {
        onLogin(false);
        return;
      }

      if (error !== '') setError('');
      try {
        await getToken({
          email: username,
        });
      } catch (e) {
        // catch error when user exist in firebase but not in our db
        showToast({
          message: 'Not able to verify the login details',
          type: 'error',
        });
      } finally {
        setLoading(false);
        setEmailSent(true);
      }
    }
  }, [isHuman, getToken, error, username, isPreviewMode]);

  if (showPersonalDetailsForm) {
    return (
      <Wrapper direction='column' width='100%' height='100%' padding='1.25rem'>
        <PersonalDetails onPersonalDetailsUpdate={onLogin} />
      </Wrapper>
    );
  }

  return (
    <Wrapper
      width='100%'
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      padding={
        location.pathname === RoutesHashMap.Login.path ||
        location.pathname === ''
          ? '1.5rem 0.75rem'
          : '0'
      }
    >
      <Animated
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={
          location.pathname === RoutesHashMap.Login.path || retractDrawer
            ? 0
            : 300
        }
        animationOutDuration={
          location.pathname === RoutesHashMap.Login.path || retractDrawer
            ? 0
            : 300
        }
        animationInDelay={
          location.pathname !== RoutesHashMap.Login.path && retractDrawer
            ? 200
            : 0
        }
        animateOnMount
        isVisible={true}
        style={{ width: '100%' }}
      >
        <Wrapper
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          padding='0 0.5rem'
          overflow='hidden'
        >
          <Wrapper
            direction='column'
            width='100%'
            justifyContent='flex-start'
            alignItems='flex-start'
            transition='0.2s'
            overflow='hidden'
            padding='0.25rem 0 0 0'
            margin='0 0 0.25rem 0'
            height={emailRegistration ? '58px' : '0px'}
          >
            <Wrapper
              width='100%'
              ref={inputWrapperRef}
              alignItems='stretch'
              position='relative'
            >
              <EditInput
                width={width}
                value={username}
                placeholder={
                  username === ''
                    ? t('emailInputPlaceholder')
                    : t('emailInputFilledPlaceholder')
                }
                type='email'
                onChange={(value) => handleUsernameChanged(value)}
              />
            </Wrapper>
          </Wrapper>
          {showRecaptcha && emailRegistration ? (
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY_v2 as string}
              onChange={onRecaptchaSuccess}
            />
          ) : null}
          <Wrapper width='100%' justifyContent='center' alignItems='center'>
            {loading || magicLinkLoading ? (
              <LoadingIndicator />
            ) : (
              <Button
                variant={emailRegistration ? 'dark' : 'light'}
                transition='0.2s'
                brandTheme={brandTheme}
                disabled={emailRegistration && !emailValidated}
                margin={emailValidated ? '1px 0' : '0'}
                style={
                  !emailRegistration
                    ? { border: '1px solid #636369', color: '#000000' }
                    : {}
                }
                onClick={() =>
                  emailRegistration
                    ? handleLogin()
                    : toggleEmailRegistration(true)
                }
              >
                {emailRegistration ? (
                  <EmailLogoAlternate fill={emailValidated ? brandTheme : ''} />
                ) : (
                  <EmailLogo />
                )}
                {emailSent && emailRegistration
                  ? t('checkYourEmail')
                  : emailRegistration
                  ? t(emailValidated ? 'activateWithEmail' : 'enterEmailAbove')
                  : isDrawer
                  ? `${getRegisterText(registrationType)} ${t('withEmail')}`
                  : t('continueWithEmail')}
              </Button>
            )}
          </Wrapper>
          {emailRegistration ? (
            <button
              type='button'
              onClick={() => toggleEmailRegistration(false)}
              style={{
                height: '52px',
                width: '100%',
                textAlign: 'center',
                textDecoration: 'underline',
                cursor: 'pointer',
                letterSpacing: '0.3px',
                margin: '0.5rem 0 0 0',
                fontWeight: 'bold',
                transition: '02s',
                borderRadius: '5rem',
                background: 'transparent',
              }}
            >
              {t('useDifferentOption')}
            </button>
          ) : (
            <SocialLogin
              isDrawer={isDrawer}
              setLoading={setLoading}
              onSuccess={onLogin}
              buttonPrefix={getRegisterText(registrationType)}
            />
          )}
          <Wrapper width='100%' justifyContent='center' padding='0 1rem'>
            <Text fontSize='0.7rem' textDecoration='unset'>
              <span>{magicLinkError}</span>
            </Text>
          </Wrapper>
          <Wrapper width='100%' justifyContent='center' padding='0 1rem'>
            <Text fontSize='0.7rem' textDecoration='unset'>
              <span>{success}</span>
            </Text>
          </Wrapper>
        </Wrapper>
      </Animated>
    </Wrapper>
  );
};

export default LoginForm;
