import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import PageHeader from "components/PageHeader";
import Wrapper from "components/Wrapper";
import Button from "components/Button";
import Input from "components/Input";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Text from "components/Text";
import { showToast } from "components/Toast/Toast";
import LoadingIndicator from "components/LoadingIndicator";

const useFirebaseError = () => {
  const { t } = useTranslation("translation", { keyPrefix: "firebaseErrors" });

  const getErrorMessage = useCallback((code) => {
    return t(code);
  }, [t])

  return getErrorMessage;
}

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "forgotPassword" });
  const [emailInput, setEmailInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const getErrorMessage = useFirebaseError();

  const auth = getAuth();

  const sendResetEmail = useCallback(async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, emailInput);
      showToast({ message: "Password reset email sent", type: "success" });
      history.push('/');
    } catch (error: any) {
      showToast({ message: getErrorMessage(error.code), type: "error" });
    } finally {
      setLoading(false);
    }
  }, [emailInput, auth, history, getErrorMessage])

  return (
    <Wrapper
      width="100%"
      height="100%"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <PageHeader
        border
        title={t("pageHeaderTitle")}
        goBack={() => history.push("/")}
      />
      <Wrapper
        width="100%"
        height="100%"
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        padding="2rem 1rem"
        gap="1.2rem"
        overflow="auto"
        margin="2rem 0"
      >
        <Wrapper
          direction="column"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Input
            type="text"
            value={emailInput}
            placeholder={t("emailInput")}
            onChange={({ target: { value } }) => setEmailInput(value)}
            margin="0 0 1rem"
          />
        </Wrapper>
      </Wrapper>
      <Wrapper
        width="100%"
        justifyContent="center"
        alignItems="center"
        padding="0 1rem 1.5rem"
      >
        {
          loading ? <LoadingIndicator /> : (
            <Button variant="dark" onClick={sendResetEmail}>
              <Text color="#fff">
                <span>{t("sendEmailLink")}</span>
              </Text>
            </Button>
          )
        }
      </Wrapper>
    </Wrapper>
  );
};

export default ForgotPassword;
