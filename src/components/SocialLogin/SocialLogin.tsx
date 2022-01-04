import { ReactComponent as FacebookLogo } from "assets/logos/svg/facebook.svg";
import { ReactComponent as GoogleLogo } from "assets/logos/svg/google.svg";
import Button from "components/Button";

import { showToast } from "components/Toast/Toast";
import Wrapper from "components/Wrapper";
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import useFirebaseError from "hooks/useFirebaseError";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ProviderName } from "types/Auth";

interface SocialLoginProps {
  setLoading: (loading: boolean) => void,
  onSuccess: () => void
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  setLoading,
  onSuccess
}) => {
  const { t } = useTranslation("translation", { keyPrefix: "socialLogin" });

  const auth = getAuth();
  const getFirebaseError = useFirebaseError();

  const handleSocialAuth = useCallback((providerName: ProviderName) => {
    setLoading(true);

    let provider = null;

    switch (providerName) {
      case ProviderName.Facebook:
        provider = new FacebookAuthProvider();
        break;
      case ProviderName.Google:
        provider = new GoogleAuthProvider();
        break;
      default:
        provider = new GoogleAuthProvider();
    }

    signInWithPopup(auth, provider)
      .then(() => {
        showToast({ message: t("signInToastMessage"), type: "success" });
        onSuccess();
      })
      .catch((error) => {
        showToast({ message: getFirebaseError(error.code), type: "error" });
      })
      .finally(() => setLoading(false))
  }, [auth, t, onSuccess]);

  return (
    <Wrapper
      width="100%"
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap="1rem"
    >
      <Button
        variant="light"
        onClick={() => handleSocialAuth(ProviderName.Google)}
      >
        <GoogleLogo /> {t("googleButton")}
      </Button>
      <Button
        variant="light"
        onClick={() => handleSocialAuth(ProviderName.Google)}
      >
        <FacebookLogo /> {t("facebookButton")}
      </Button>
    </Wrapper>
  );
};

export default SocialLogin;
