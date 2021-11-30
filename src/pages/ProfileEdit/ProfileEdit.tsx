import React, { useEffect, useState } from "react";
import { ReactComponent as CameraIcon } from "assets/icons/svg/camera.svg";
import { useHistory } from "react-router";
import Avatar from "components/Avatar";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import EditInput from "components/EditInput";
import PageHeader from "components/PageHeader";
import avatar from "assets/images/png/avatar.png";

const ProfileEdit: React.FC = () => {
  const history = useHistory();

  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // setUserName(user?.username);
    // setUserPhone(user?.phone);
    // setUserEmail(user?.emails[0].address);
  }, []);

  const handleUserName = (value: string) => {
    setUserName(value);
  };

  const handleUserPhone = (value: string) => {
    setUserPhone(value);
  };

  const handleUserEmail = (value: string) => {
    setUserEmail(value);
  };

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      overflow="auto"
    >
      <PageHeader title="Profile" goBack={() => history.goBack()} />
      <Wrapper
        width="100%"
        height="100%"
        padding="1rem"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Wrapper width="100%" justifyContent="center" alignItems="center">
          <Wrapper width="40%" justifyContent="center" alignItems="center">
            <Avatar>
              <img src={avatar} alt="Profile avatar" />
            </Avatar>
          </Wrapper>
          <Wrapper width="60%" justifyContent="center" alignItems="center">
            <Button>
              <CameraIcon /> Change Image
            </Button>
          </Wrapper>
        </Wrapper>
        <Wrapper width="100%" direction="column" gap="1rem" padding="2rem 0">
          <EditInput
            value={userName}
            placeholder="Full Name"
            onChange={handleUserName}
          />
          <EditInput
            value={userPhone}
            placeholder="Phone Number"
            onChange={handleUserPhone}
          />
          <EditInput
            value={userEmail}
            placeholder="Email"
            onChange={handleUserEmail}
          />
        </Wrapper>
      </Wrapper>
      <Wrapper
        width="100%"
        justifyContent="center"
        alignItems="center"
        padding="1rem"
      >
        <Button theme="dark" onClick={() => history.push("/profile")}>
          Save Changes
        </Button>
      </Wrapper>
    </Wrapper>
  );
};

export default ProfileEdit;
