import brijLogo from "assets/logos/svg/brij-colored.svg";
import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";
import Button from "components/Button";
import Image from "components/Image";
import Input from "components/Input";
import LoadingIndicator from "components/LoadingIndicator";
import PageFooter from "components/PageFooter";
import PageHeader from "components/PageHeader";
import Text from "components/Text";
import Wrapper from "components/Wrapper";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import useRedirectLoggedInUser from "hooks/useRedirectLoggedInUser";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { useGlobal } from "../../context/global/GlobalContext";
import useMagicLinkHandler from "hooks/useMagicLinkHandler";

const Login: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "signIn" });
  const { pageState } = useGlobal();
  const history = useHistory();
  const auth = getAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [token, setToken] = useState<string | undefined>("");
  const [user, setUser] = useState<User | undefined>(undefined);
  const [usingMagicLink, setUsingMagicLink] = useState<boolean>(true);

  console.log("GLOBAL PAGE STATE: ", pageState);

  // redirect loggedIn user
  useRedirectLoggedInUser(token, user);

  // get magic link header
  const {
    handleMagicLink,
    loading: magicLinkLoading,
    error: magicLinkError,
    success,
  } = useMagicLinkHandler(username);

  const handleGoogleAuth = useCallback(() => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => setUser(result.user))
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MSG: ", error.message);
        // // The email of the user's account used.
        // const email = error.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }, [auth]);

  const handleFacebookAuth = useCallback(() => {
    history.push("/collection");
  }, [history]);

  const handleUsernameChanged = useCallback(
    ({ target: { value } }) => setUsername(value),
    []
  );

  const handlePasswordChanged = useCallback(
    ({ target: { value } }) => setPassword(value),
    []
  );

  const logo = useMemo(
    () => <Image width="auto" src={brijLogo} alt="Brij logo" />,
    []
  );

  useEffect(() => {
    async function fetchData() {
      const token = await user?.getIdToken();
      setToken(token);
    }
    if (user) fetchData();
  }, [user]);

  const handleLogin = () => {
    setLoading(true);
    if (error !== "") setError("");
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MSG: ", error.message);
        setLoading(false);
      });
  };

  const passwordInput = !usingMagicLink ? (
    <Input
      type="password"
      value={password}
      placeholder={t("passwordInput")}
      onChange={handlePasswordChanged}
    />
  ) : null;

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
          <Button theme="light" onClick={handleFacebookAuth}>
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
            value={username}
            placeholder={t("emailInput")}
            onChange={handleUsernameChanged}
            margin="0 0 1rem"
          />
          {passwordInput}
          <Wrapper width="100%" justifyContent="space-between" padding="0 1rem">
            <Text
              fontSize="0.7rem"
              textDecoration="unset"
              onClick={() => setUsingMagicLink(!usingMagicLink)}
            >
              <span>{usingMagicLink ? "Use password" : "Use magic link"}</span>
            </Text>
            <Text fontSize="0.7rem" textDecoration="unset">
              <Link to="/forgot-password">{t("forgotPassword")}</Link>
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
                usingMagicLink ? handleMagicLink() : handleLogin()
              }
            >
              {usingMagicLink ? t("magicLinkButton") : t("signInButton")}
            </Button>
          )}
        </Wrapper>
        <Wrapper width="100%" justifyContent="center" padding="0 1rem">
          <Text fontSize="0.7rem" textDecoration="unset">
            <span>{magicLinkError}</span>
          </Text>
        </Wrapper>
        <Wrapper width="100%" justifyContent="center" padding="0 1rem">
          <Text fontSize="0.7rem" textDecoration="unset">
            <span>{success}</span>
          </Text>
        </Wrapper>
      </Wrapper>
      <PageFooter>
        <p>{t("newToBrij")}?</p>
        <Link to={"/signup"}>{t("signUpLink")}</Link>
      </PageFooter>
    </Wrapper>
  );
};

export default Login;
