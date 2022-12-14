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
import { UserStruct } from 'types/User';

interface UserUpdatePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface PersonalDetailsProps {
  onPersonalDetailsUpdate?: () => void;
  saveToShopify?: boolean;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  onPersonalDetailsUpdate = () => {},
  saveToShopify,
}) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const { t } = useTranslation('translation', { keyPrefix: 'personalDetails' });
  const { brandTheme, getPersonalDetails, personalDetails, slug } = useGlobal();

  const [updateShopify] = useAPI<any>({
    method: 'POST',
    endpoint: 'integrations/shopify/create_or_update_customer',
    onSuccess: () => {},
    onError: () => {},
  });

  const onSuccess = useCallback(
    (userDetails: UserStruct) => {
      getPersonalDetails();

      if (saveToShopify) {
        const { username, profile } = userDetails;

        updateShopify({
          slug,
          userId: personalDetails?._id,
          userDetails: {
            username,
            profile,
          },
        });
      }

      onPersonalDetailsUpdate();
    },
    [
      onPersonalDetailsUpdate,
      getPersonalDetails,
      updateShopify,
      slug,
      personalDetails,
      saveToShopify,
    ]
  );

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

      if (
        details.phoneNumber &&
        details.phoneNumber.replace(/[^\d]/g, '').length !== 11
      ) {
        showToast({
          message: 'Please add a valid phone number',
          type: 'error',
        });
        return;
      }

      updateUser({
        ...details,
        phoneNumber: details.phoneNumber
          ? details.phoneNumber.replace(/[^\d]/g, '').substring(1, 11)
          : '',
      });
    },
    [updateUser]
  );

  return (
    <Wrapper
      width='100%'
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
          className='complete-profile-firstname'
          type='text'
          value={firstName}
          placeholder={t('firstNameInputPlaceholder')}
          onChange={(e) => setFirstName(e.target.value)}
          margin='0 0 1rem'
        />
        <Input
          className='complete-profile-lastname'
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
              className='complete-profile-phone'
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
              margin='0.75rem 0 0 0'
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
