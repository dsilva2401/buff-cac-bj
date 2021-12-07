import React, { useState, useEffect, useCallback } from "react";
import {
  User,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendSignInLinkToEmail,
} from "@firebase/auth";
import Text from "components/Text";
import Input from "components/Input";
import Image from "components/Image";
import Button from "components/Button";
import Wrapper from "components/Wrapper";
import SuccessDrawer from "components/SuccessDrawer";
import registerBanner from "assets/images/png/register-warranty.png";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { ReactComponent as Mail } from "assets/icons/svg/mail.svg";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";
import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";
import LoadingIndicator from "components/LoadingIndicator";

type RegistrationDrawerProps = {
  isAuthenticated: boolean;
  registrationData: any;
  setPageTitle: (title: string) => void;
  closePage(): void;
};

const RegistrationDrawer: React.FC<RegistrationDrawerProps> = ({
  registrationData,
  isAuthenticated,
  setPageTitle,
  closePage,
}) => {
  const [successDrawer, setSuccessDrawer] = useState<boolean>(isAuthenticated);
  const [profileComplete, setProfileComplete] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(
    window.localStorage.getItem("emailForSignIn") || ""
  );
  const [errorResponse, setErrorResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [token, setToken] = useState<string | undefined>("");
  const [user, setUser] = useState<User | undefined>(undefined);

  const history = useHistory();
  const auth = getAuth();

  const { t } = useTranslation("translation", {
    keyPrefix: "drawers.registrationDrawer",
  });

  const confirmRegistration = () => {
    setSuccessDrawer(true);
  };

  const closeSuccess = useCallback(() => {
    setSuccessDrawer(false);
    closePage();
  }, [closePage]);

  useEffect(() => {
    if (successDrawer) {
      setTimeout(() => {
        setSuccessDrawer(false);
        if (profileComplete) closePage();
      }, 3000);
    }
  }, [successDrawer, registrationData, closePage, profileComplete]);

  useEffect(() => {
    if (
      isAuthenticated &&
      !successDrawer &&
      registrationData?.nextLink &&
      !profileComplete
    ) {
      setPageTitle(t("detailsForm.title"));
    }
  }, [
    t,
    isAuthenticated,
    profileComplete,
    registrationData,
    setPageTitle,
    successDrawer,
  ]);

  useEffect(() => {
    if (isAuthenticated && !successDrawer && profileComplete) {
      if (registrationData?.nextLink) history.push(registrationData?.nextLink);
      else closePage();
    }
  }, [
    closePage,
    isAuthenticated,
    profileComplete,
    registrationData,
    successDrawer,
    history,
  ]);

  const handleGoogleAuth = useCallback(() => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("SIGNIN RESULT: ", result.user);
        setUser(result.user);
      })
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MSG: ", error.message);
      });
  }, [auth]);

  useEffect(() => {
    async function fetchData() {
      const token = await user?.getIdToken();
      setToken(token);
      console.log("TOKEN: ", token);
    }
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (token) {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        firstName: user?.displayName,
        lastName: "",
      });

      fetch("https://damp-wave-40564.herokuapp.com/auth", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      })
        .then((response) => {
          if (response.status === 200) {
            confirmRegistration();
          }
        })
        .catch((error) => {
          console.log("ERROR CODE: ", error.code);
          console.log("ERROR MSG: ", error.message);
        });
      setLoading(false);
    }
  }, [user, token, history]);

  const clearError = () => {
    if (errorResponse !== "") {
      setErrorResponse("");
    }
  };

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("emailForSignIn");
    if (isSignInWithEmailLink(auth, window.location.href) && !!savedEmail) {
      signInWithEmailLink(auth, savedEmail, window.location.href);
    }
  }, [auth]);

  const updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearError();
    setEmail(e.target.value);
  };

  const handleEmailSignIn = async () => {
    if (isSignInWithEmailLink(auth, window.location.href) && !!email) {
      signInWithEmailLink(auth, email, window.location.href).catch((err) => {
        switch (err.code) {
          default:
            setErrorResponse("An unknown error has occured");
        }
      });
    } else {
      sendSignInLinkToEmail(auth, email, {
        url: "http://localhost:3000/product/3xpm",
        handleCodeInApp: true,
      })
        .then(() => {
          window.localStorage.setItem("emailForSignIn", email);
        })
        .catch((err) => {
          switch (err.code) {
            default:
              setErrorResponse("An unknown error has occured");
          }
        });
    }
  };

  const ProfileForm = () => (
    <>
      <Input
        type="text"
        value={firstName}
        placeholder={t("detailsForm.firstNameInput")}
        onChange={({ target: { value } }) => setFirstName(value)}
        margin="1rem 0 0"
      />
      <Input
        type="text"
        value={lastName}
        placeholder={t("detailsForm.lastNameInput")}
        onChange={({ target: { value } }) => setLastName(value)}
      />
      <Input
        type="text"
        value={phoneNumber}
        placeholder={t("detailsForm.phoneNumberInput")}
        onChange={({ target: { value } }) => setPhoneNumber(value)}
      />
      <Input
        type="password"
        value={password}
        placeholder={t("detailsForm.passwordInput")}
        onChange={({ target: { value } }) => setPassword(value)}
      />
      <Input
        type="password"
        value={confirmPassword}
        placeholder={t("detailsForm.confirmPasswordInput")}
        onChange={({ target: { value } }) => setConfirmPassword(value)}
        margin="0 0 0.5rem"
      />
      <Button
        theme="dark"
        onClick={() => setProfileComplete(true)}
        disabled={
          !firstName ||
          !lastName ||
          !phoneNumber ||
          !password ||
          !confirmPassword
        }
      >
        {t("detailsForm.submitButton")}
      </Button>
      <Button
        theme="light"
        onClick={() => setProfileComplete(true)}
        disabled={false}
      >
        {t("detailsForm.doLaterButton")}
      </Button>
    </>
  );

  if (!isAuthenticated) {
    return (
      <Wrapper width="100%" direction="column" padding="0 0.5rem">
        <Wrapper
          width="100%"
          position="relative"
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          margin="0 0 2rem"
          gap="1rem"
          after={{
            content: " ",
            position: "absolute",
            bottom: "-1rem",
            height: "1px",
            width: "100%",
            background: "#CBD1D4",
          }}
          responsiveImg
        >
          <Image src={registerBanner} alt="Register Banner" rounded />
          <Text
            fontSize="0.8rem"
            color="#1b1b1b"
            padding="0 0.5rem"
            textAlign="left"
          >
            <Text
              fontSize="0.8rem"
              color="#98A3AA"
              padding="0 0.5rem"
              textAlign="left"
              fontWeight="700"
            >
              <p>{registrationData?.heading}</p>
            </Text>
            <p>{registrationData?.description}</p>
          </Text>
        </Wrapper>
        <Wrapper width="100%" direction="column">
          <Wrapper width="100%" direction="column" gap="1rem">
            <Text fontSize="0.7rem" color="#1b1b1b" padding="0 0.5rem">
              <p>{t("signInDisclaimer")}</p>
            </Text>
            <Wrapper width="100%" direction="column" gap="1rem">
              <Button theme="light" onClick={handleGoogleAuth}>
                <GoogleLogo /> {t("googleButton")}
              </Button>
              <Button theme="light">
                <FacebookLogo /> {t("facebookButton")}
              </Button>
            </Wrapper>
          </Wrapper>
        </Wrapper>
        <Wrapper width="100%" direction="column" padding="0 0 1rem">
          <Wrapper width="100%" justifyContent="center" margin="1rem 0">
            <Text fontSize="1.2rem" color="#98A3AA">
              <p>or</p>
            </Text>
          </Wrapper>
          <Wrapper width="100%" direction="column">
            <Input
              type="text"
              value={email}
              placeholder={t("emailInput")}
              onChange={updateEmail}
              margin="0 0 1rem"
            />
            <Button
              theme="light"
              onClick={handleEmailSignIn}
              disabled={
                !email ||
                !email.includes(".com") ||
                !email.includes("@") ||
                email.length < 6
              }
            >
              <Mail /> {t("emailRegisterButton")}
            </Button>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    );
  }

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
        <SuccessDrawer
          isOpen={successDrawer}
          title={t("successDrawer.title")}
          description={t("successDrawer.description")}
          close={closeSuccess}
        />
      )}
      {!profileComplete && ProfileForm()}
    </>
  );
};

export default RegistrationDrawer;
