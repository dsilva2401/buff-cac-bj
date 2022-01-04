import { useCallback } from "react";
import { useTranslation } from "react-i18next";

const useFirebaseError = () => {
  const { t } = useTranslation("translation", { keyPrefix: "firebaseErrors" });

  const getErrorMessage = useCallback((code) => {
    return t(code);
  }, [t])

  return getErrorMessage;
}

export default useFirebaseError;
