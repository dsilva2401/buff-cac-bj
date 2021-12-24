import React, { useEffect, useState } from "react";
import { getNameInitials } from "utils/getInitials";
import { showToast } from "components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { User, getAuth } from "firebase/auth";
import { useHistory } from "react-router";
import Avatar from "components/Avatar";
import Image from "components/Image";
import Text from "components/Text";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import EditInput from "components/EditInput";
import PageHeader from "components/PageHeader";
import LoadingIndicator from "components/LoadingIndicator";

const ProfileEdit: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "profile" });
  const history = useHistory();
  const auth = getAuth();

  const [userName, setUserName] = useState<string | null>("");
  const [userPhone, setUserPhone] = useState<string | null>("");
  const [userEmail, setUserEmail] = useState<string | null>("");
  const [userImage, setUserImage] = useState<string | null>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [detailsUpdated, setDetailsUpdated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      setUserName(user?.displayName);
      setUserPhone(user?.phoneNumber);
      setUserEmail(user?.email);
      setUserImage(user?.photoURL);
      setUser(user);
      setLoading(false);
    } else {
      showToast({ message: t("errorToastMessage"), type: "error" });
      setLoading(false);
    }
  }, [auth, t]);

  const handleProfileUpdate = () => {
    setUpdating(true);
    console.log("USER NAME: ", userName);
    console.log("USER EMAIL: ", userEmail);

    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTQzNzFiMmU4NmY4MGM1YzYxNThmNDUzYzk0NTEyNmZlNzM5Y2MiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYnJpai1jb25zdW1lci1hcHAiLCJhdWQiOiJicmlqLWNvbnN1bWVyLWFwcCIsImF1dGhfdGltZSI6MTY0MDE2MDg1NywidXNlcl9pZCI6IlBWb1lFR0VXeE1VcWtQUVdHWTROSkpvZkpJZzEiLCJzdWIiOiJQVm9ZRUdFV3hNVXFrUFFXR1k0TkpKb2ZKSWcxIiwiaWF0IjoxNjQwMTYwODU3LCJleHAiOjE2NDAxNjQ0NTcsImVtYWlsIjoiY29sbGVjdGlvbnRlc3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImNvbGxlY3Rpb250ZXN0QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.lwZo7FP1HMf4Yipbi38AnKIy-PqGTQdghRHdxL81sM1BOQF9Xb42SrQ-s5rlu-6DCRVBEDRgfv381QNDAQiCB54qjWjN_F79nqXEGxhVyr3NMy1jL4TRwBX6Ozywq4qPrftffHolOrc0tM-4em3wBpTEHnRdz1_gtEiLLYa7SmC_Fr3Oq_rv0yf4olekAV0yaPlxeEGeX-Ez7JB7moNaiueXdm1xWWL5l_ipOpNKX4YE2jSJKp8Zmv74QF7HP9_R6KqDA4O2CbMWWGhpq529iPPgT2rFBcCeJ47Z0uhTUEKUv0pB-gfdOwm8rkF3c-RyWhAWQ7OWK601XWEjJoPn7Q"
    );
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
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
          setUpdating(false);
          showToast({ message: t("updateToastMessage"), type: "success" });
        }
      })
      .then((result) => console.log(result))
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
        setUpdating(false);
      });
  };

  const detectChanges = () => {
    if (
      userName === user?.displayName ||
      userPhone === user?.phoneNumber ||
      userEmail === user?.email
    )
      setDetailsUpdated(true);
    else setDetailsUpdated(false);
  };

  console.log(
    "Name: ",
    userName,
    " UserName: ",
    user?.displayName,
    " Result: ",
    detailsUpdated
  );

  const handleUserName = (value: string) => {
    setUserName(value === "" ? null : value);
    detectChanges();
  };

  const handleUserPhone = (value: string) => {
    setUserPhone(value === "" ? null : value);
    detectChanges();
  };

  const handleUserEmail = (value: string) => {
    setUserEmail(value === "" ? null : value);
    detectChanges();
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
                  <h1>
                    {userName
                      ? getNameInitials(userName)
                      : userEmail?.charAt(0).toUpperCase()}
                  </h1>
                </Text>
              )}
            </Avatar>
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
        {updating ? (
          <LoadingIndicator />
        ) : detailsUpdated ? (
          <Button theme="dark" onClick={() => handleProfileUpdate()}>
            {t("saveChanges")}
          </Button>
        ) : null}
      </Wrapper>
    </Wrapper>
  );
};

export default ProfileEdit;
