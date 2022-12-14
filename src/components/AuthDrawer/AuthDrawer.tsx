import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobal } from 'context/global/GlobalContext';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { Animated } from 'react-animated-css';
import HtmlWrapper from 'components/HtmlWrapper';
import LoginForm from 'components/LoginForm';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';

interface AuthDrawerProps {
  onAuthComplete: (isNewUser?: boolean) => void;
  html: string | undefined | null;
  margin?: string;
  animated?: boolean;
  productName?: string;
  brandName?: string;
  showMulberryTerms?: boolean;
  onAuthOpen?: () => void;
  hideSignupOptions?: boolean;
}

const AuthDrawer: React.FC<AuthDrawerProps> = ({
  onAuthComplete,
  html,
  animated,
  brandName,
  productName,
  showMulberryTerms,
  onAuthOpen,
  hideSignupOptions,
}) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.authDrawer',
  });
  const { retractDrawer, slug } = useGlobal();

  // call on auth open
  useEffect(() => {
    if (onAuthOpen) {
      onAuthOpen();
    }
  }, [onAuthOpen]);

  return (
    <Animated
      animationIn='slideInRight'
      animationOut='slideOutLeft'
      animationInDuration={retractDrawer ? 0 : 200}
      animationOutDuration={retractDrawer ? 0 : 200}
      animateOnMount
      isVisible={true}
      style={{ width: '100%' }}
    >
      <Wrapper
        width='100%'
        direction='column'
        justifyContent='flex-start'
        alignItems='center'
        height='100%'
        position='relative'
        margin='1.5rem 0'
        padding={animated ? '1.5rem 0 2rem 0' : '0 0 2rem 0'}
        style={{ borderTop: animated ? '2px solid #E7EAEB' : '0' }}
      >
        {html && (
          <HtmlWrapper
            width='100%'
            padding='0 0.5rem'
            direction='column'
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        {!animated && (
          <Wrapper
            width='calc(100% - 16px)'
            height='2px'
            background='#E7EAEB'
            margin='1rem 0'
          />
        )}
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.REACT_APP_RECAPTCHA_KEY}
        >
          <LoginForm
            isDrawer
            onLogin={onAuthComplete}
            hideSignupOptions={hideSignupOptions}
          />
        </GoogleReCaptchaProvider>
        <Wrapper padding='0.5rem'>
          <Text fontSize='0.625rem' textAlign='left' color='#414149'>
            <p>
              {t('termsAndconditions.part1')}
              {brandName}
              {t('termsAndconditions.part2')}
              {showMulberryTerms
                ? t('termsAndconditions.mulberryAndBrijBrand')
                : t('termsAndconditions.brijBrand')}
              <a
                target='_blank'
                rel='noreferrer'
                href={t('termsAndconditions.link')}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {t('termsAndconditions.linkText')}
              </a>
              {'.'}
              {t('termsAndconditions.part3')}
              <a
                target='_blank'
                rel='noreferrer'
                href={`mailto:help@brij.it?subject=Help with ${brandName} ${productName} (${slug})`}
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {t('termsAndconditions.helpEmail')}
              </a>
              {'.'}
            </p>
          </Text>
        </Wrapper>
      </Wrapper>
    </Animated>
  );
};

export default AuthDrawer;
