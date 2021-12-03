import React, { useEffect, useState } from "react";
import { ReactComponent as CameraIcon } from "assets/icons/svg/camera.svg";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import Avatar from "components/Avatar";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import EditInput from "components/EditInput";
import PageHeader from "components/PageHeader";
import avatar from "assets/images/png/avatar.png";

const ProfileEdit: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "profileEdit" });
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
              <img src={avatar} alt="profile-avatar" />
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
            value={userName}
            placeholder={t("fullNameInput")}
            onChange={handleUserName}
          />
          <EditInput
            value={userPhone}
            placeholder={t("phoneNumberInput")}
            onChange={handleUserPhone}
          />
          <EditInput
            value={userEmail}
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
