import { useGlobal } from "context/global/GlobalContext";
import { showToast } from "components/Toast/Toast";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useEffect, useRef } from "react";
import { User } from "firebase/auth";

const useRedirectLoggedInUser = (token?: string, user?: User) => {
  const { t } = useTranslation("translation", { keyPrefix: "magicLink" });
  const { signInRedirect, setSignInRedirect } = useGlobal();
  const history = useHistory();

  // create a copy of signInRedirect so it doesn't change when singInRedirect
  // sets to empty which will cause the redirection to occur again
  // We will fix this once the user will be in the global context

  const redirect = useRef<string>(signInRedirect);

  useEffect(() => {
    if (token) {
      console.log(token, "token");

      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        firstName: user?.displayName,
        lastName: "",
        // tag: "0SVJ",
      });

      fetch("https://damp-wave-40564.herokuapp.com/auth", {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      })
        .then((response) => {
          if (response.status === 200) {
            if (redirect.current) {
              setSignInRedirect("");
              history.push(redirect.current);
            } else history.push("/collection");
          }
        })
        .catch((error) => {
          showToast({ message: error.message, type: "error" });
        });
    }
  }, [user, token, history, setSignInRedirect, t]);
};

export default useRedirectLoggedInUser;
