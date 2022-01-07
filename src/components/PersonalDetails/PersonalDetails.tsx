import React, { useCallback, useState } from 'react';
import { useGlobal } from 'context/global/GlobalContext';
import { useTranslation } from 'react-i18next';
import { useAPI } from 'utils/api';
import Input from 'components/Input';
import Button from 'components/Button';
import InputMask from 'react-input-mask';
import Wrapper from 'components/Wrapper';
import AnimatedWrapper from 'components/AnimatedWrapper';
import LoadingIndicator from 'components/LoadingIndicator';

interface UserUpdatePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface PersonalDetailsProps {
  onPersonalDetailsUpdate?: () => void
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  onPersonalDetailsUpdate = () => { }
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'personalDetails' });
  const { pageTransition } = useGlobal();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const onSuccess = useCallback(() => {
    onPersonalDetailsUpdate();
  }, [])

  const [updateUser, loading] = useAPI<UserUpdatePayload>(
    {
      method: 'PUT',
      endpoint: 'auth/update',
      onSuccess,
      onError: (error) => {
        console.log(error)
      }
    }
  );

  return (
    <AnimatedWrapper direction={pageTransition}>
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
            value={firstName}
            placeholder={t('firstNameInputPlaceholder')}
            onChange={(e) => setFirstName(e.target.value)}
            margin='0 0 1rem'
          />
          <Input
            type='text'
            value={lastName}
            placeholder={t('lastNameInputPlaceholder')}
            onChange={(e) => setLastName(e.target.value)}
            margin='0 0 1rem'
          />
          <InputMask
            value={phoneNumber}
            mask='(+1) 999 999 9999'
            onChange={(e) => setPhoneNumber(e.target.value)}
          >
            {() => (
              <Input
                type='tel'
                pattern='[+-]?\d+(?:[.,]\d+)?'
                placeholder={t('phoneNumberInputPlaceholder')}
                margin='0 0 1rem'
              />
            )}
          </InputMask>
        </Wrapper>
        <Wrapper width='100%' justifyContent='center' alignItems='center'>
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Button
              variant='dark'
              onClick={() =>
                updateUser({
                  firstName,
                  lastName,
                  phoneNumber,
                })
              }
            >
              {t('continueButton')}
            </Button>
          )}
        </Wrapper>
      </Wrapper>
    </AnimatedWrapper>
  );
};

export default PersonalDetails;
