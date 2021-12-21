import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";
import Button from "components/Button";
import Input from "components/Input";
import LoadingIndicator from "components/LoadingIndicator";
import Text from "components/Text";
import Wrapper from "components/Wrapper";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import useMagicLinkHandler from "hooks/useMagicLinkHandler";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const SignUpForm: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "signUp" });
  const history = useHistory();
  const auth = getAuth();

  const [usingMagicLink, setUsingMagicLink] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // get magic link header
  const {
    handleMagicLink,
    loading: magicLinkLoading,
    error,
    success,
  } = useMagicLinkHandler(email, true);

  const handleGoogleAuth = useCallback(() => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => console.log(result.user))
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MSG: ", error.message);
      });
  }, [auth]);

  const signUpWithEmailAndPassword = () => {
    setLoading(true);
    if (errorMessage !== "") setErrorMessage("");
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => console.log(result.user))
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

  const passwordInput = !usingMagicLink ? (
    <Input
      type="password"
      value={password}
      placeholder={t("passwordInput")}
      onChange={({ target: { value } }) => setPassword(value)}
    />
  ) : null;

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
        {passwordInput}
        <Wrapper width="100%" justifyContent="center" padding="0 1rem">
          <Text
            fontSize="0.7rem"
            textDecoration="unset"
            onClick={() => setUsingMagicLink(!usingMagicLink)}
          >
            <span>{usingMagicLink ? "Use password" : "Use magic link"}</span>
          </Text>
        </Wrapper>
      </Wrapper>
      <Wrapper width="100%" justifyContent="center" alignItems="center">
        {loading || magicLinkLoading ? (
          <LoadingIndicator />
        ) : (
          <Button
            theme="dark"
            onClick={() =>
              usingMagicLink ? handleMagicLink() : signUpWithEmailAndPassword()
            }
          >
            {usingMagicLink ? t("magicLinkButton") : t("signUpButton")}
          </Button>
        )}
      </Wrapper>
      <Wrapper width="100%" justifyContent="center" padding="0 1rem">
        <Text fontSize="0.7rem" textDecoration="unset">
          <span>{error}</span>
        </Text>
      </Wrapper>
      <Wrapper width="100%" justifyContent="center" padding="0 1rem">
        <Text fontSize="0.7rem" textDecoration="unset">
          <span>{success}</span>
        </Text>
      </Wrapper>
    </Wrapper>
  );
};

export default SignUpForm;
