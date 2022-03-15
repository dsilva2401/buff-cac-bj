import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { theme } from 'styles/theme';
import { useAPI } from 'utils/api';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showToast } from 'components/Toast/Toast';
import { getNameInitials } from 'utils/getInitials';
import { useGlobal } from 'context/global/GlobalContext';
import LoadingIndicator from 'components/LoadingIndicator';
import PageHeader from 'components/PageHeader';
import InputMask from 'react-input-mask';
import Wrapper from 'components/Wrapper';
import Button from 'components/Button';
import Avatar from 'components/Avatar';
import Input from 'components/Input';
import Text from 'components/Text';

interface UserUpdatePayload {
  firstName: string | undefined;
  lastName: string | undefined;
  phoneNumber: string | undefined;
}

interface PersonalDetailsProps {
  onPersonalDetailsUpdate?: () => void;
}

const Profile: React.FC<PersonalDetailsProps> = ({
  onPersonalDetailsUpdate = () => {},
}) => {
  const { t } = useTranslation('translation', { keyPrefix: 'profile' });
  const { t: personalDetailsTranslation } = useTranslation('translation', {
    keyPrefix: 'personalDetails',
  });
  const { user, personalDetails, getPersonalDetails } = useGlobal();
  const history = useHistory();

  const { profile } = personalDetails || {};

  const [firstName, setFirstName] = useState<string | undefined>('');
  const [lastName, setLastName] = useState<string | undefined>('');
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>('');

  const onSuccess = useCallback(() => {
    showToast({ message: t('updateToastMessage'), type: 'success' });
    getPersonalDetails();
    onPersonalDetailsUpdate();
  }, [onPersonalDetailsUpdate, t]);

  const [updateUser, loading] = useAPI<UserUpdatePayload>({
    method: 'PUT',
    endpoint: 'auth/update',
    onSuccess,
    onError: (error) => {
      showToast({ message: error, type: 'error' });
    },
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile?.firstName);
      setLastName(profile?.lastName);
      setPhoneNumber(profile?.phoneNumber);
    }
  }, [profile]);

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='space-between'
        position='relative'
        overflow='auto'
      >
        <PageHeader
          title={t('pageHeaderTitle')}
          goBack={() => history.goBack()}
        />
        <Wrapper
          width='100%'
          height='100%'
          direction='column'
          justifyContent='space-between'
          alignItems='center'
          overflow='auto'
          padding='2rem 1rem'
          gap='1.2rem'
        >
          <Wrapper
            width='100%'
            alignItems='center'
            direction='column'
            margin='2rem 0'
            gap='1.2rem'
          >
            <Wrapper
              width='40%'
              justifyContent='center'
              alignItems='center'
              margin='0 0 1.25rem 0'
            >
              <Avatar>
                <Text color={theme.primary} fontSize='3rem'>
                  <h1>
                    {firstName && lastName
                      ? getNameInitials(firstName + ' ' + lastName)
                      : user?.email?.charAt(0)?.toUpperCase()}
                  </h1>
                </Text>
              </Avatar>
            </Wrapper>

            <Wrapper
              direction='column'
              width='100%'
              justifyContent='center'
              alignItems='center'
            >
              <Input
                type='text'
                value={firstName}
                placeholder={t('firstNameInput')}
                onChange={(e) => setFirstName(e.target.value)}
                margin='0 0 1rem'
              />
              <Input
                type='text'
                value={lastName}
                placeholder={t('lastNameInput')}
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
                    placeholder={personalDetailsTranslation(
                      'phoneNumberInputPlaceholder'
                    )}
                    margin='0 0 1rem'
                  />
                )}
              </InputMask>
              <Input
                disabled
                type='text'
                placeholder={personalDetails?.emails[0]?.email}
                margin='0 0 1rem'
              />
            </Wrapper>
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
                {t('saveChanges')}
              </Button>
            )}
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </>
  );
};

export default Profile;
