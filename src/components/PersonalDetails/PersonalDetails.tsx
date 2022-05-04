import React, { useCallback, useState } from 'react';
import { useGlobal } from 'context/global/GlobalContext';
import { showToast } from 'components/Toast/Toast';
import { useTranslation } from 'react-i18next';
import { useAPI } from 'utils/api';
import Text from 'components/Text';
import Input from 'components/Input';
import Button from 'components/Button';
import LoadingIndicator from 'components/LoadingIndicator';
import InputMask from 'react-input-mask';
import Wrapper from 'components/Wrapper';

interface UserUpdatePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface PersonalDetailsProps {
  onPersonalDetailsUpdate?: () => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  onPersonalDetailsUpdate = () => {},
}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const { t } = useTranslation('translation', { keyPrefix: 'personalDetails' });
  const { brandTheme, getPersonalDetails } = useGlobal();

  const onSuccess = useCallback(() => {
    getPersonalDetails();
    onPersonalDetailsUpdate();
  }, [onPersonalDetailsUpdate, getPersonalDetails]);

  const [updateUser, loading] = useAPI<UserUpdatePayload>({
    method: 'PUT',
    endpoint: 'auth/update',
    onSuccess,
    onError: (error) => {
      console.log(error);
    },
  });

  const validateUserInformation = useCallback(
    (details: UserUpdatePayload) => {
      if (!details.firstName) {
        showToast({ message: 'First name is required', type: 'error' });
        return;
      }
      if (!details.lastName) {
        showToast({ message: 'Last name is required', type: 'error' });
        return;
      }
      updateUser(details);
    },
    [updateUser]
  );

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='flex-start'
      alignItems='center'
      overflow='auto'
      margin='0 0 4rem'
      gap='0.5rem'
    >
      <Text
        fontSize='1rem'
        fontWeight='600'
        padding='1.5rem 0.75rem'
        style={{ width: '100%' }}
      >
        <p>{t('pageTitle')}</p>
      </Text>
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
      <Wrapper
        width='100%'
        justifyContent='center'
        alignItems='center'
        direction='column'
      >
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>
            <Button
              variant='dark'
              brandTheme={brandTheme}
              onClick={() =>
                validateUserInformation({
                  firstName,
                  lastName,
                  phoneNumber,
                })
              }
            >
              {t('continueButton')}
            </Button>
            <Button
              variant='light'
              brandTheme={brandTheme}
              marginTop='0.75rem'
              onClick={onPersonalDetailsUpdate}
            >
              {t('skip')}
            </Button>
          </>
        )}
      </Wrapper>
    </Wrapper>
  );
};

export default PersonalDetails;
