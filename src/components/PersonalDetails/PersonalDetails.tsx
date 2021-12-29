import Button from "components/Button";
import Input from "components/Input";
import LoadingIndicator from "components/LoadingIndicator";
import Wrapper from "components/Wrapper";
import React, { useCallback, useState } from "react";
import { useAPI } from "utils/api";

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
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      padding="2rem 1rem"
      gap="1.2rem"
      overflow="auto"
      margin="2rem 0"
    >
      <Wrapper
        direction="column"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Input
          type="text"
          value={firstName}
          placeholder={"First Name"}
          onChange={(e) => setFirstName(e.target.value)}
          margin="0 0 1rem"
        />
        <Input
          type="text"
          value={lastName}
          placeholder={"Last Name"}
          onChange={(e) => setLastName(e.target.value)}
          margin="0 0 1rem"
        />
        <Input
          type="text"
          value={phoneNumber}
          placeholder={"Phone Number"}
          onChange={(e) => setPhoneNumber(e.target.value)}
          margin="0 0 1rem"
        />
      </Wrapper>
      <Wrapper width="100%" justifyContent="center" alignItems="center">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <Button
            variant="dark"
            onClick={() =>
              updateUser({
                firstName,
                lastName,
                phoneNumber,
              })
            }
          >
            Continue
          </Button>
        )}
      </Wrapper>
    </Wrapper>
  );
};

export default PersonalDetails;
