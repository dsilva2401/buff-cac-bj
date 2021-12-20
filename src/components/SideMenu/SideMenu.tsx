import React, { useCallback, useEffect, useState } from "react";
import { useGlobal } from "../../context/global/GlobalContext";
import { Link, useLocation } from "react-router-dom";
import { showToast } from "components/Toast/Toast";
import { getAuth, signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { ReactComponent as Close } from "assets/icons/svg/close-white.svg";
import { ReactComponent as Collection } from "assets/icons/svg/collection.svg";
import { ReactComponent as External } from "assets/icons/svg/external.svg";
import { ReactComponent as LoadingIndicator } from "assets/icons/svg/loading-small.svg";
import { ReactComponent as Logout } from "assets/icons/svg/log-out.svg";
import { ReactComponent as Profile } from "assets/icons/svg/person.svg";
import brijLogo from "assets/logos/svg/brij.svg";
import DrawerMask from "components/DrawerMask";
import Image from "components/Image";
import Menu from "./styles";

const SideMenu: React.FC = () => {
  const { t } = useTranslation("translation", { keyPrefix: "sideMenu" });
  const { isMenuOpen, setIsMenuOpen } = useGlobal();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const location = useLocation();
  const history = useHistory();
  const auth = getAuth();

  const { productDetails: details } = useGlobal();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
      } else setSignedIn(false);
    });
  }, [auth]);

  const handleLogoutButtonClicked = useCallback(() => {
    if (error !== "") setError("");
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoading(false);
        showToast({ message: t("signOutToastMessage"), type: "success" });
        history.push("/");
      })
      .catch((error) => {
        showToast({ message: error.message, type: "error" });
      });
    setIsMenuOpen(false);
  }, [setIsMenuOpen, auth, history, error, t]);

  return (
    <>
      <DrawerMask
        isDrawerOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        zIndex={9}
      />
      <Menu isMenuOpen={isMenuOpen}>
        <div>
          <span>
            <button onClick={() => setIsMenuOpen(false)}>
              <Close />
            </button>
          </span>
          <nav>
            {signedIn ? (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                {t("myProfile")}
                <Profile />
              </Link>
            ) : null}
            {signedIn && location.pathname !== "/collection" ? (
              <Link to="/collection" onClick={() => setIsMenuOpen(false)}>
                {t("myCollection")}
                <Collection />
              </Link>
            ) : null}
            {details && (
              <a
                href={details?.brand?.website || ""}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("visitWebsite")}
                <External />
              </a>
            )}
            {signedIn ? (
              <Link to="/" onClick={handleLogoutButtonClicked}>
                {t("signOut")}
                {loading ? <LoadingIndicator /> : <Logout />}
              </Link>
            ) : (
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                {t("signIn")}
                <Logout />
              </Link>
            )}
          </nav>
          <span>
            <Image width="auto" src={brijLogo} alt="brij-logo" />
          </span>
        </div>
      </Menu>
    </>
  );
};

export default SideMenu;
