import React, { useCallback, useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useGlobal } from 'context/global/GlobalContext';
import { showToast } from 'components/Toast/Toast';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { RoutesHashMap } from 'routes';
import PageHeader from 'components/PageHeader';
import useFirebaseError from 'hooks/useFirebaseError';
import AnimatedWrapper from 'components/AnimatedWrapper';
import LoadingIndicator from 'components/LoadingIndicator';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Input from 'components/Input';
import Text from 'components/Text';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'forgotPassword' });
  const { pageTransition, setPageTransition } = useGlobal();
  const getErrorMessage = useFirebaseError();
  const history = useHistory();
  const auth = getAuth();

  const [emailInput, setEmailInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sendResetEmail = useCallback(async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, emailInput);
      showToast({ message: 'Password reset email sent', type: 'success' });
      history.push(RoutesHashMap.Login.path);
    } catch (error: any) {
      showToast({ message: getErrorMessage(error.code), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [emailInput, auth, history, getErrorMessage])

  return (
    <AnimatedWrapper direction={pageTransition}>
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='space-between'
        alignItems='center'
      >
        <PageHeader
          border
          title={t('pageHeaderTitle')}
          goBack={() => {
            setPageTransition('RIGHT');
            history.push(RoutesHashMap.Login.path);
          }}
        />
        <Wrapper
          width='100%'
          height='100%'
          direction='column'
          justifyContent='flex-start'
          alignItems='center'
          padding='2rem 1rem'
          gap='1.2rem'
          overflow='auto'
          margin='2rem 0'
        >
          <Wrapper
            direction='column'
            width='100%'
            justifyContent='center'
            alignItems='center'
          >
            <Input
              type='text'
              value={emailInput}
              placeholder={t('emailInput')}
              onChange={({ target: { value } }) => setEmailInput(value)}
              margin='0 0 1rem'
            />
          </Wrapper>
        </Wrapper>
        <Wrapper
          width='100%'
          justifyContent='center'
          alignItems='center'
          padding='0 1rem 1.5rem'
        >
          {
            loading ? <LoadingIndicator /> : (
              <Button variant='dark' onClick={sendResetEmail}>
                <Text color='#fff'>
                  <span>{t('sendEmailLink')}</span>
                </Text>
              </Button>
            )
          }
        </Wrapper>
      </Wrapper>
    </AnimatedWrapper>
  );
};

export default ForgotPassword;
