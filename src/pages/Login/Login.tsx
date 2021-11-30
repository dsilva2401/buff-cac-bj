import React, { useCallback, useMemo, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { logMessage } from '../../utils/index';
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageFooter from "components/PageFooter";
import PageHeader from "components/PageHeader";
import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Input from "components/Input";
import Image from "components/Image";
import Text from "components/Text";
import brijLogo from "assets/logos/svg/brij-colored.svg";
import LoadingIndicator from "components/LoadingIndicator";
import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";

const Login: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "signIn" });
  const history = useHistory();
  const auth = getAuth();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGoogleAuth = useCallback(() => {
    history.push("/collection");
  }, [history]);

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

  // if (loading) {
  //   logMessage('Loading indicator');
  // }

  // if (error) {
  //   logMessage('There was an error logging in');
  // }

  // if (user) {
  //   history.push('/');
  // }

  const handleLogin = () => {
    setLoading(true);
    if (error !== "") setError("");
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        console.log(userCredential);
        history.push("/collection");
      })
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR CODE: ", error.message);
        setLoading(false);
      });
  };

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <PageHeader border title={t("title")} logo={logo} />
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
          <Input
            type="password"
            value={password}
            placeholder={t("passwordInput")}
            onChange={handlePasswordChanged}
          />
          <Wrapper width="100%" justifyContent="flex-end" padding="0 1rem">
            <Text fontSize="0.7rem" textDecoration="unset">
              <Link to="/forgot-password">{t("forgotPassword")}</Link>
            </Text>
          </Wrapper>
        </Wrapper>
        <Wrapper width="100%" justifyContent="center" alignItems="center">
          {loading ? (
            <LoadingIndicator />
          ) : (
            <Button theme="dark" onClick={() => handleLogin()}>
              {t("signInButton")}
            </Button>
          )}
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
