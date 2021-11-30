import React, { useState } from "react";
import { useHistory } from "react-router";
import Text from "components/Text";
import Button from "components/Button";
import Avatar from "components/Avatar";
import Wrapper from "components/Wrapper";
import PageHeader from "components/PageHeader";
import IconButton from "components/IconButton";
import AlertDrawer from "components/AlertDrawer";
import avatar from "assets/images/png/avatar.png";

const Profile: React.FC = () => {
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const editButton = (
    <Wrapper width="100%" justifyContent="flex-end">
      <IconButton
        theme="light"
        iconName="edit"
        onClick={() => history.push("/profile/edit")}
      />
    </Wrapper>
  );

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      overflow="auto"
    >
      <AlertDrawer
        isDrawerOpen={isDrawerOpen}
        closeDrawer={closeDrawer}
        callbackAction={closeDrawer}
      />
      <PageHeader
        title="Profile"
        goBack={() => history.push("/collection")}
        actionButton={editButton}
      />
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        padding="1.5rem 3rem"
      >
        <Wrapper
          width="100%"
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          gap="1.5rem"
        >
          <Wrapper justifyContent="center" alignItems="center">
            <Avatar>
              <img src={avatar} alt="Profile avatar" />
            </Avatar>
          </Wrapper>
          <Wrapper
            width="100%"
            direction="column"
            justifyContent="flex-start"
            gap="1rem"
          >
            <Wrapper
              width="100%"
              direction="column"
              justifyContent="flex-start"
            >
              <Text fontSize="0.5rem" color="#98A3AA">
                <span>Full Name</span>
              </Text>
              <Text fontSize="0.9rem" color="#414149">
                <p>Contact Name</p>
              </Text>
            </Wrapper>
            <Wrapper
              width="100%"
              direction="column"
              justifyContent="flex-start"
            >
              <Text fontSize="0.5rem" color="#98A3AA">
                <span>Phone Number</span>
              </Text>
              <Text fontSize="0.9rem" color="#414149">
                <p>XXXX-XXXX-XXX</p>
              </Text>
            </Wrapper>
            <Wrapper
              width="100%"
              direction="column"
              justifyContent="flex-start"
            >
              <Text fontSize="0.5rem" color="#98A3AA">
                <span>Email</span>
              </Text>
              <Text fontSize="0.9rem" color="#414149">
                <p>example@xyz.com</p>
                {/* <p>{user?.emails![0]!.address}</p> */}
              </Text>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Wrapper>
      <Wrapper
        width="100%"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        gap="1rem"
        padding="0 1rem 1.5rem"
      >
        <Button theme="light" onClick={() => history.push("/reset-password")}>
          Reset Password
        </Button>
        <Button theme="light" warning onClick={() => setIsDrawerOpen(true)}>
          Delete Account
        </Button>
      </Wrapper>
    </Wrapper>
  );
};

export default Profile;
