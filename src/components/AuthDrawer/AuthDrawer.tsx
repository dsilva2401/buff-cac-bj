import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useGlobal } from 'context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { Animated } from 'react-animated-css';
import LoginForm from 'components/LoginForm';
import HtmlWrapper from 'components/HtmlWrapper';
import LoadingIndicator from 'components/LoadingIndicator';
import Wrapper from 'components/Wrapper';
import Text from 'components/Text';

interface AuthDrawerProps {
  onAuthComplete: (isNewUser?: boolean) => void;
  html: string | undefined | null;
  margin?: string;
  animated?: boolean;
  brandName?: string;
  showMulberryTerms?: boolean;
  onAuthOpen?: () => void;
}

const AuthDrawer: React.FC<AuthDrawerProps> = ({
  onAuthComplete,
  html,
  animated,
  brandName,
  showMulberryTerms,
  onAuthOpen,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { t } = useTranslation('translation', {
    keyPrefix: 'drawers.authDrawer',
  });
  const { retractDrawer } = useGlobal();

  // call on auth open
  useEffect(() => {
    if (onAuthOpen) {
      onAuthOpen();
    }
  }, [onAuthOpen]);

  const onSuccess = useCallback(
    (isNewUser?: boolean) => {
      onAuthComplete(isNewUser);
      setLoading(true);
    },
    [onAuthComplete]
  );

  const authScreenToRender = useMemo(() => {
    return <LoginForm isDrawer onLogin={onSuccess} />;
  }, [onSuccess]);

  if (loading) return <LoadingIndicator />;

  return (
    <Wrapper
      width='100%'
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      gap='1.2rem'
      overflow='auto'
      height='100%'
      margin={animated ? '1.5rem 0 0 0' : '3.75rem 0 0 0'}
    >
      {html && (
        <HtmlWrapper
          gap='1rem'
          width='100%'
          padding='0 1rem'
          direction='column'
          alignItems='center'
          justifyContent='center'
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      <Animated
        animationIn='slideInRight'
        animationOut='slideOutLeft'
        animationInDuration={retractDrawer ? 0 : 300}
        animationOutDuration={retractDrawer ? 0 : 300}
        animateOnMount
        isVisible={true}
        style={{ width: '100%' }}
      >
        <Wrapper padding='0 1rem' style={{ borderTop: '2px solid #E7EAEB' }}>
          <Text
            margin='1rem 0 0 0'
            fontSize='0.625rem'
            textAlign='left'
            color='#414149'
          >
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
                href='https://brij.it/terms'
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
              >
                {t('termsAndconditions.link')}
              </a>
            </p>
          </Text>
        </Wrapper>
      </Animated>
      {authScreenToRender}
    </Wrapper>
  );
};

export default AuthDrawer;
