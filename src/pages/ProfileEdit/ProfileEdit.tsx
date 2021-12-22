import React, { useEffect, useState } from "react";
import { ReactComponent as CameraIcon } from "assets/icons/svg/camera.svg";
import { getNameInitials } from "utils/getInitials";
import { showToast } from "components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { getAuth } from "firebase/auth";
import Avatar from "components/Avatar";
import Image from "components/Image";
import Text from "components/Text";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import EditInput from "components/EditInput";
import PageHeader from "components/PageHeader";
import LoadingIndicator from "components/LoadingIndicator";

const ProfileEdit: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "profileEdit" });
  const history = useHistory();
  const auth = getAuth();

  const [userName, setUserName] = useState<string | null>("");
  const [userPhone, setUserPhone] = useState<string | null>("");
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [userImage, setUserImage] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      console.log("USER: ", user);
      setUserName(user?.displayName);
      setUserPhone(user?.phoneNumber);
      setUserEmail(user?.email);
      setUserImage(user?.photoURL)
      setLoading(false);
    } else {
      showToast({ message: t("errorToastMessage"), type: "error" });
      setLoading(false);
    }
  }, [auth, t]);

  const handleUserName = (value: string) => {
    setUserName(value);
  };

  const handleUserPhone = (value: string) => {
    setUserPhone(value);
  };

  const handleUserEmail = (value: string) => {
    setUserEmail(value);
  };

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
      <PageHeader
        title={t("pageHeaderTitle")}
        goBack={() => history.goBack()}
      />
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
              {userImage ? (
                <Image src={userImage} alt="profile-avatar" />
              ) : (
                <Text color="#414149" fontSize="3rem">
                  <h1>{getNameInitials(userName)}</h1>
                </Text>
              )}
            </Avatar>
          </Wrapper>
          <Wrapper width="60%" justifyContent="center" alignItems="center">
            <Button>
              <CameraIcon /> {t("changeImage")}
            </Button>
          </Wrapper>
        </Wrapper>
        <Wrapper width="100%" direction="column" gap="1rem" padding="2rem 0">
          <EditInput
            value={userName || undefined}
            placeholder={t("fullNameInput")}
            onChange={handleUserName}
          />
          <EditInput
            value={userPhone || undefined}
            placeholder={t("phoneNumberInput")}
            onChange={handleUserPhone}
          />
          <EditInput
            value={userEmail || undefined}
            placeholder={t("emailInput")}
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
          {t("saveChanges")}
        </Button>
      </Wrapper>
    </Wrapper>
  );
};

export default ProfileEdit;
