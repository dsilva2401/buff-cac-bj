import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  User,
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import PageHeader from "components/PageHeader";
import PageFooter from "components/PageFooter";
import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Input from "components/Input";
import Image from "components/Image";
import Text from "components/Text";
import brijLogo from "assets/logos/svg/brij-colored.svg";
import LoadingIndicator from "components/LoadingIndicator";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";
import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";

const SignUp: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "signUp" });
  const history = useHistory();
  const auth = getAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [token, setToken] = useState<string | undefined>("");
  const [user, setUser] = useState<User | undefined>(undefined);

  const logo = <Image width="auto" src={brijLogo} alt="brij-logo" />;

  const handleGoogleAuth = useCallback(() => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MSG: ", error.message);
      });
  }, [auth]);

  const signUpWithEmailAndPassword = () => {
    setLoading(true);
    if (errorMessage !== "") setErrorMessage("");
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => setUser(result.user))
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MSG: ", error.message);

        if (error.code.includes("auth/weak-password")) {
          setErrorMessage("Please enter a stronger password.");
        } else if (error.code.includes("auth/email-already-in-use")) {
          setErrorMessage("Email already in use.");
        } else {
          setErrorMessage("Unable to register. Please try again later.");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    async function fetchData() {
      const token = await user?.getIdToken();
      setToken(token);
    }
    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (token) {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      console.log("GOOGLE USER OBJECT: ", user);

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
            history.push("/collection");
          }
        })
        .catch((error) => {
          console.log("ERROR CODE: ", error.code);
          console.log("ERROR MSG: ", error.message);
        });
      setLoading(false);
    }
  }, [user, token, history]);

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <PageHeader border title={t("pageHeaderTitle")} logo={logo} />
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        padding="2rem 1rem"
        gap="1.2rem"
        overflow="auto"
      >
        <Wrapper
          width="100%"
          direction="column"
          justifyContent="center"
          alignItems="center"
          gap="1rem"
        >
          <Button theme="light" onClick={handleGoogleAuth}>
            <GoogleLogo /> {t("googleButton")}
          </Button>
          <Button theme="light" onClick={() => history.push("/collection")}>
            <FacebookLogo /> {t("facebookButton")}
          </Button>
        </Wrapper>

        <Wrapper justifyContent="center" alignItems="center">
          <Text fontSize="1.2rem" color="#98A3AA">
            <p>or</p>
          </Text>
        </Wrapper>

        <Wrapper
          direction="column"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Input
            type="text"
            value={email}
            placeholder={t("emailInput")}
            onChange={({ target: { value } }) => setEmail(value)}
            margin="0 0 1rem"
          />
          <Input
            type="password"
            value={password}
            placeholder={t("passwordInput")}
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </Wrapper>
        <Wrapper width="100%" justifyContent="center" alignItems="center">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Button theme="dark" onClick={() => signUpWithEmailAndPassword()}>
              {t("signUpButton")}
            </Button>
          )}
        </Wrapper>
      </Wrapper>
      <PageFooter>
        <p>{t("existingUser")}</p>
        <Link to={"/"}>{t("signInLink")}</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default SignUp;
