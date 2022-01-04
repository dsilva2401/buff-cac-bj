import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Text from "components/Text";
import Input from "components/Input";

import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import { Link } from "react-router-dom";
import useMagicLinkHandler from "hooks/useMagicLinkHandler";
import LoadingIndicator from 'components/LoadingIndicator';
import { showToast } from "components/Toast/Toast";
import useFirebaseError from "hooks/useFirebaseError";
import SocialLogin from "components/SocialLogin";

interface LoginFormProps {
  onLogin?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin = () => {}
}) => {
  const { t } = useTranslation("translation", { keyPrefix: "signIn" });

  const auth = getAuth();
  const getErrorMessage = useFirebaseError();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [usingMagicLink, setUsingMagicLink] = useState<boolean>(true);

  // get magic link header
  const {
    handleMagicLink,
    loading: magicLinkLoading,
    error: magicLinkError,
    success
  } = useMagicLinkHandler(username);

  const handleUsernameChanged = useCallback(
    ({ target: { value } }) => setUsername(value),
    []
  );

  const handlePasswordChanged = useCallback(
    ({ target: { value } }) => setPassword(value),
    []
  );

  const handleLogin = () => {
    setLoading(true);
    if (error !== "") setError("");
    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        onLogin();
        showToast({ message: t("signInToastMessage"), type: "success" });
      })
      .catch((error) => {
        showToast({ message: getErrorMessage(error.code), type: "error" });
        setLoading(false);
      })
      .finally(() => setLoading(false))
  };

  const passwordInput = (
    !usingMagicLink ? (
      <Input
        type='password'
        value={password}
        placeholder={t('passwordInput')}
        onChange={handlePasswordChanged}
      />
    ) : null
  )

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      padding="2rem 1rem"
      gap="1.2rem"
      margin="2rem 0"
    >
      <SocialLogin
        setLoading={setLoading}
        onSuccess={onLogin}
      />

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
            variant="dark"
            onClick={() => (usingMagicLink ? handleMagicLink() : handleLogin())}
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
  );
};

export default LoginForm;
