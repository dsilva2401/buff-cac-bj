import React, { useEffect, useState } from "react";
import { getNameInitials } from "utils/getInitials";
import { showToast } from "components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { User, getAuth } from "firebase/auth";
import { useHistory } from "react-router";
import { theme } from "styles/theme";
import Avatar from "components/Avatar";
import Image from "components/Image";
import Text from "components/Text";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import EditInput from "components/EditInput";
import PageHeader from "components/PageHeader";
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
  const { t } = useTranslation("translation", { keyPrefix: "profile" });
  const history = useHistory();
  const auth = getAuth();

  const [profile, setProfile] = useState<ProfileType>(initalValues);
  const [userName, setUserName] = useState<string | null>("");
  const [userPhone, setUserPhone] = useState<string | null>("");
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [detailsUpdated, setDetailsUpdated] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      setProfile({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoUrl: typeof user.photoURL === "string" ? user.photoURL : "",
      });
      setUser(user);
      setLoading(false);
    } else {
      showToast({ message: t("errorToastMessage"), type: "error" });
      setLoading(false);
    }
  }, [auth, t]);

  useEffect(() => {
    async function fetchToken() {
      const token = await user?.getIdToken();
      setToken(token);
    }
    if (user) fetchToken();
  }, [user]);

  const handleProfileUpdate = () => {
    setUpdating(true);
    let myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${token}`
    );
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      firstName: userName,
      phoneNumber: userPhone,
      lastName: "",
    });

    fetch("https://damp-wave-40564.herokuapp.com/auth/update", {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    })
      .then((response) => {
        if (response.status === 200) {
          showToast({ message: t("updateToastMessage"), type: "success" });
          setDetailsUpdated(false);
        }
        setUpdating(false);
      })
      .then((result) => console.log(result))
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
        setUpdating(false);
      });
  };

  const detectChanges = () => {
    if (
      userName !== profile.displayName ||
      userPhone !== profile.phoneNumber ||
      userEmail !== profile.email
    )
      setDetailsUpdated(true);
    else setDetailsUpdated(false);
  };

  useEffect(() => {
    detectChanges()
  }, [userName, userPhone, userEmail])

  console.log(
    "Name: ",
    userName,
    " UserName: ",
    user?.displayName,
    " Result: ",
    detailsUpdated
  );

  const handleUserName = (value: string) => {
    setUserName(profile.displayName = value);
    console.log("PROFILE: ", profile)
  };

  const handleUserPhone = (value: string) => {
    setUserPhone(profile.phoneNumber = value);
  };

  const handleUserEmail = (value: string) => {
    setUserEmail(profile.email = value);
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
              {profile.photoUrl !== "" ? (
                <Image src={profile.photoUrl} alt="profile-avatar" />
              ) : (
                <Text color={theme.primary} fontSize="3rem">
                  <h1>
                    {userName
                      ? getNameInitials(userName)
                      : profile?.email?.charAt(0)?.toUpperCase()}
                  </h1>
                </Text>
              )}
            </Avatar>
          </Wrapper>
        </Wrapper>
        <Wrapper width="100%" direction="column" gap="1rem" padding="2rem 0">
          <EditInput
            value={profile.displayName || ""}
            placeholder={t("fullNameInput")}
            onChange={handleUserName}
          />
          <EditInput
            value={profile.phoneNumber || ""}
            placeholder={t("phoneNumberInput")}
            onChange={handleUserPhone}
          />
          <EditInput
            value={profile.email || ""}
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
        {updating ? (
          <LoadingIndicator />
        ) : detailsUpdated ? (
          <Button variant="dark" onClick={() => handleProfileUpdate()}>
            {t("saveChanges")}
          </Button>
        ) : null}
      </Wrapper>
    </Wrapper>
  );
};

export default Profile;
