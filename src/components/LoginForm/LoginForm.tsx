import React, { useState, useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import { RoutesHashMap } from 'routes';
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
import { useSuccessDrawerContext } from 'context/SuccessDrawerContext/SuccessDrawerContext';
import { usePreview } from 'hooks/usePreview';
interface LoginFormProps {
  isDrawer?: boolean;
  onLogin?: (isNewUser?: boolean) => void;
  onPersonalDetails?: () => void;
  hideSignupOptions?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin = () => {},
  isDrawer,
  hideSignupOptions,
}) => {
  const [emailRegistration, toggleEmailRegistration] = useState<boolean>(false);
  const [emailValidated, setEmailValidated] = useState<boolean>(false);
  const [animateFields, toggleAnimateFields] = useState<boolean>(true);
  const [showRecaptcha, setShowRecaptcha] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isHuman, setHuman] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [showPersonalDetailsForm, togglePersonalDetailsForm] =
    useState<boolean>(false);

  const { t } = useTranslation('translation', { keyPrefix: 'signIn' });
  const { brandTheme, productDetails, isPreviewMode, setRegisteringProduct } =
    useGlobal();
  const [inputWrapperRef, { width }] = useElementSize();
  const getErrorMessage = useFirebaseError();
  const isVerified = useRecaptchaV3();
  const location = useLocation();
  const auth = getAuth();

  const { openDrawer, closeDrawer } = useSuccessDrawerContext();

  const { showSuccessPreviewDrawer } = usePreview();

  // sync isVerified with isHuman
  useEffect(() => {
    // if user is not verified show backup recaptcha
    if (!isVerified) setShowRecaptcha(true);
    setHuman(isVerified);
  }, [isVerified]);

  useEffect(() => {
    if (!emailValidated) setEmailSent(false);
  }, [emailValidated]);

  useEffect(() => {
    if (isDrawer && hideSignupOptions) {
      toggleAnimateFields(false);
      toggleEmailRegistration(true);
    }
  }, [hideSignupOptions, isDrawer]);

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
    setEmailSent(false);
  };

  const onSuccess = useCallback(
    (response: any) => {
      if (response.existingUser) {
        setLoading(false);
        return handleMagicLink();
      } else if (response.token) {
        if (isDrawer) {
          openDrawer();
        }

        signInWithCustomToken(auth, response.token)
          .then(() => {
            if (!isDrawer) {
              togglePersonalDetailsForm(true);
            } else {
              setRegisteringProduct(true);
              onLogin(true);
              setLoading(false);
            }
          })
          .catch((error) => {
            closeDrawer();
            showToast({ message: getErrorMessage(error.code), type: 'error' });
          });
      }
    },
    [handleMagicLink, auth, isDrawer, onLogin, getErrorMessage, closeDrawer]
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
        message: t('toastMessages.completeRecaptchaVerification'),
        type: 'error',
      });
      return;
    } else if (!emailValidated) {
      showToast({ type: 'error', message: t('toastMessages.invalidEmail') });
      return;
    } else {
      setLoading(true);
      if (isPreviewMode) {
        onLogin(false);
        showSuccessPreviewDrawer();
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
          message: t('toastMessages.cantVerifyLoginDetails'),
          type: 'error',
        });
      } finally {
        setEmailSent(true);
      }
      let w: any = window;
      w.dataLayer.push({ event: 'userRegistrationEvent' });
    }
  }, [isHuman, getToken, error, username, isDrawer, isPreviewMode, openDrawer]);

  if (showPersonalDetailsForm) {
    return (
      <Wrapper direction='column' width='100%' height='100%' padding='1.25rem'>
        <PersonalDetails onPersonalDetailsUpdate={onLogin} />
      </Wrapper>
    );
  }

  const getRegisterButtonText = () => {
    if (emailRegistration) {
      if (emailSent) return t('checkYourEmail');
      if (isDrawer) {
        if (emailValidated)
          return `${getRegisterText(registrationType)} ${t('withEmail')}`;
        else return t('enterEmailAbove');
      } else {
        return t(emailValidated ? 'continueWithEmail' : 'enterEmailAbove');
      }
    } else {
      if (isDrawer)
        return `${getRegisterText(registrationType)} ${t('withEmail')}`;
      else return t('continueWithEmail');
    }
  };

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
      overflow='hidden'
      padding={
        location.pathname === RoutesHashMap.Login.path ||
        location.pathname === ''
          ? '1.5rem 1.25rem'
          : '0 0.5rem'
      }
    >
      <Wrapper
        direction='column'
        width='100%'
        justifyContent='flex-start'
        alignItems='flex-start'
        overflow='hidden'
        transition={animateFields ? '0.2s' : '0'}
        padding={emailRegistration ? '0.25rem 0 0 0' : '0'}
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
            className='email-register-input'
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
      <Wrapper
        width='100%'
        height='56px'
        justifyContent='center'
        alignItems='center'
        overflow='visible'
      >
        {loading || magicLinkLoading ? (
          <LoadingIndicator />
        ) : (
          <Button
            className={`${emailRegistration ? '' : 'pre'}register-btn email ${
              emailValidated ? 'valid-email' : ''
            }`}
            variant={emailRegistration ? 'dark' : 'light'}
            transition='0.2s'
            brandTheme={brandTheme}
            disabled={
              (emailRegistration && emailSent) ||
              (emailRegistration && !emailValidated)
            }
            style={
              !emailRegistration
                ? { border: '1px solid #636369', color: '#000000' }
                : {}
            }
            onClick={() =>
              emailRegistration ? handleLogin() : toggleEmailRegistration(true)
            }
          >
            {emailRegistration ? (
              <EmailLogoAlternate fill={emailValidated ? brandTheme : ''} />
            ) : (
              <EmailLogo />
            )}
            {getRegisterButtonText()}
          </Button>
        )}
      </Wrapper>
      {emailRegistration ? (
        <button
          type='button'
          onClick={() => {
            toggleEmailRegistration(false);
            !animateFields && toggleAnimateFields(true);
          }}
          style={{
            height: '52px',
            width: '100%',
            textAlign: 'center',
            textDecoration: 'underline',
            cursor: 'pointer',
            letterSpacing: '0.3px',
            margin: '0.5rem 0 0 0',
            fontWeight: 'bold',
            transition: '0.2s',
            borderRadius: '5rem',
            background: 'transparent',
          }}
        >
          {t('useDifferentOption')}
        </button>
      ) : (
        !loading && (
          <SocialLogin
            isDrawer={isDrawer}
            setLoading={setLoading}
            onSuccess={onLogin}
            buttonPrefix={getRegisterText(registrationType)}
          />
        )
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
  );
};

export default LoginForm;
