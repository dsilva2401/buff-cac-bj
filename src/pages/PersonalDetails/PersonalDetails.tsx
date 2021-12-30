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
import PersonalDetails from 'components/PersonalDetails';

interface UserUpdatePayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const PersonalDetailsPage: React.FC = () => {
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
    <PersonalDetails onPersonalDetailsUpdate={() => {}} />
  );
};

export default PersonalDetailsPage;
