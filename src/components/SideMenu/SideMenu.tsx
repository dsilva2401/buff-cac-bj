import React, { useState, useEffect, useCallback, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useHistory } from "react-router";
import { GlobalContext } from "context";
import Menu from "./styles";
import Image from "components/Image";
import DrawerMask from "components/DrawerMask";
import brijLogo from "assets/logos/svg/brij.svg";
import { ReactComponent as LoadingIndicator } from "assets/icons/svg/loading-small.svg";
import { ReactComponent as Logout } from "assets/icons/svg/log-out.svg";
import { ReactComponent as Profile } from "assets/icons/svg/person.svg";
import { ReactComponent as Close } from "assets/icons/svg/close-white.svg";
import { ReactComponent as External } from "assets/icons/svg/external.svg";
import { ReactComponent as Collection } from "assets/icons/svg/collection.svg";

const SideMenu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const auth = getAuth();
  const { isMenuOpen, setIsMenuOpen } = useContext(GlobalContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [signedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) setSignedIn(true);
      else setSignedIn(false);
    });
  }, [auth]);

  const handleLogoutButtonClicked = useCallback(() => {
    if (error !== "") setError("");
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoading(false);
        history.push("/");
      })
      .catch((error) => {
        console.log("ERROR CODE: ", error.code);
        console.log("ERROR MSG: ", error.message);
      });
      setIsMenuOpen(false);
  }, [setIsMenuOpen, auth, history, error]);

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
                My Profile
                <Profile />
              </Link>
            ) : null}
            {location.pathname !== "/collection" ? (
              <Link to="/collection" onClick={() => setIsMenuOpen(false)}>
                My Collection
                <Collection />
              </Link>
            ) : null}
            <a
              href="https://www.gucci.com/us/en/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              Visit Website
              <External />
            </a>
            {signedIn ? (
              <Link to="/" onClick={handleLogoutButtonClicked}>
                Sign Out
                {loading ? <LoadingIndicator /> : <Logout />}
              </Link>
            ) : (
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                Sign In
                <Logout />
              </Link>
            )}
          </nav>
          <span>
            <Image width="auto" src={brijLogo} alt="Brij logo" />
          </span>
        </div>
      </Menu>
    </>
  );
};

export default SideMenu;
