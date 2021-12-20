import React, { useState, useEffect } from "react";
import { showToast } from "components/Toast/Toast";
import { getNameInitials } from "utils/getInitials";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { getAuth } from "firebase/auth";
import Text from "components/Text";
import Image from "components/Image";
import Avatar from "components/Avatar";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import PageHeader from "components/PageHeader";
import IconButton from "components/IconButton";
import AlertDrawer from "components/AlertDrawer";
import LoadingIndicator from "components/LoadingIndicator";

type ProfileType = {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoUrl: string | undefined;
};

const initalValues = {
  uid: "",
  displayName: "",
  email: "",
  phoneNumber: "",
  photoUrl: "",
};

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileType>(initalValues);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation("translation", { keyPrefix: "profile" });
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      console.log("USER: ", user);
      setProfile({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoUrl: typeof user.photoURL === "string" ? user.photoURL : "",
      });
      setLoading(false);
    } else {
      showToast({ message: t("errorToastMessage"), type: "error" });
      setLoading(false);
    }
  }, [auth, t]);

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

  return loading ? (
    <LoadingIndicator />
  ) : (
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
          <Avatar>
            {profile?.photoUrl ? (
              <Image src={profile?.photoUrl} alt="profile-avatar" />
            ) : (
              <Text color="#414149" fontSize="3rem">
                <h1>{getNameInitials(profile?.displayName)}</h1>
              </Text>
            )}
          </Avatar>
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
                <span>{t("fullName")}</span>
              </Text>
              <Text fontSize="0.9rem" color="#414149">
                <p>{profile.displayName}</p>
              </Text>
            </Wrapper>
            <Wrapper
              width="100%"
              direction="column"
              justifyContent="flex-start"
            >
              <Text fontSize="0.5rem" color="#98A3AA">
                <span>{t("phoneNumber")}</span>
              </Text>
              <Text fontSize="0.9rem" color="#414149">
                <p>{profile.phoneNumber}</p>
              </Text>
            </Wrapper>

            <Wrapper
              width="100%"
              direction="column"
              justifyContent="flex-start"
            >
              <Text fontSize="0.5rem" color="#98A3AA">
                <span>{t("email")}</span>
              </Text>
              <Text fontSize="0.9rem" color="#414149">
                <p>{profile.email}</p>
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
          {t("resetPassword")}
        </Button>
        {/* <Button theme="light" warning onClick={() => setIsDrawerOpen(true)}>
          {t("deleteAccount")}
        </Button> */}
      </Wrapper>
    </Wrapper>
  );
};

export default Profile;
