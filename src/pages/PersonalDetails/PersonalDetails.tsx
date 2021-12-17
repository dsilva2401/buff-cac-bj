import React, { useCallback, useMemo, useState } from 'react';

import brijLogo from 'assets/logos/svg/brij-colored.svg';

import Wrapper from 'components/Wrapper';
import PageHeader from 'components/PageHeader';
import Image from 'components/Image';
import Input from 'components/Input';
import Button from 'components/Button';
import { useAPI } from 'utils/api';
import { useGlobal } from 'context/global/GlobalContext';
import { useHistory } from 'react-router-dom';
import LoadingIndicator from 'components/LoadingIndicator';

interface UserUpdatePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const PersonalDetails: React.FC = () => {
  const history = useHistory();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const { signInRedirect } = useGlobal();

  const onSuccess = useCallback(() => {
    if (signInRedirect) {
      history.push(signInRedirect)
    } else {
      history.push('/collection')
    }
  }, [history, signInRedirect])

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

  const logo = useMemo(
    () => <Image width='auto' src={brijLogo} alt='Brij logo' />,
    []
  );

  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='space-between'
      alignItems='center'
    >
      <PageHeader border logo={logo} />
      <Wrapper
        width='100%'
        height='100%'
        direction='column'
        justifyContent='flex-start'
        alignItems='center'
        padding='2rem 1rem'
        gap='1.2rem'
        overflow='auto'
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
            placeholder={"First Name"}
            onChange={e => setFirstName(e.target.value)}
            margin='0 0 1rem'
          />
          <Input
            type='text'
            value={lastName}
            placeholder={"Last Name"}
            onChange={e => setLastName(e.target.value)}
            margin='0 0 1rem'
          />
          <Input
            type='text'
            value={phoneNumber}
            placeholder={"Phone Number"}
            onChange={e => setPhoneNumber(e.target.value)}
            margin='0 0 1rem'
          />
        </Wrapper>
        <Wrapper width='100%' justifyContent='center' alignItems='center'>
          {
            loading
              ? (  <LoadingIndicator /> )
              : (
                <Button theme='dark' onClick={() => updateUser({
                  firstName,
                  lastName,
                  phoneNumber
                })}>
                  Continue
                </Button>
              )
          }
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default PersonalDetails;
