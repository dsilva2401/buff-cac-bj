import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGlobal } from '../../context/global/GlobalContext';
import { Link, useLocation } from 'react-router-dom';
import { showToast } from 'components/Toast/Toast';
import { getAuth, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { RoutesHashMap } from 'routes';
import { ReactComponent as Close } from 'assets/icons/svg/close-white.svg';
import { ReactComponent as Collection } from 'assets/icons/svg/collection.svg';
import { ReactComponent as LoadingIndicator } from 'assets/icons/svg/loading-small.svg';
import { ReactComponent as External } from 'assets/icons/svg/external.svg';
import { ReactComponent as Logout } from 'assets/icons/svg/log-out.svg';
import { ReactComponent as Profile } from 'assets/icons/svg/person.svg';
import brijLogo from 'assets/logos/svg/brij.svg';
import DrawerMask from 'components/DrawerMask';
import Image from 'components/Image';
import Menu from './styles';

function usePrevious<T>(value: T) {
  const ref = useRef<T>(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const SideMenu: React.FC = () => {
  const {
    productDetails: details,
    setSlug,
    slug,
    user,
    isMenuOpen,
    setIsMenuOpen,
    logEvent,
    brandTheme,
  } = useGlobal();
  const { t } = useTranslation('translation', { keyPrefix: 'sideMenu' });
  const previousUser = usePrevious(user);
  const location = useLocation();
  const history = useHistory();
  const auth = getAuth();

  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setSignedIn(true);
      } else setSignedIn(false);
    });
  }, [auth]);

  useEffect(() => {
    if (previousUser && !user) {
      history.push(RoutesHashMap.Login.path);
    }
  }, [previousUser, user, history]);

  const handleLogoutButtonClicked = useCallback(() => {
    if (error !== '') setError('');
    setSlug(null);
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoading(false);
        showToast({ message: t('signOutToastMessage'), type: 'success' });
      })
      .catch((error) => {
        showToast({ message: error.message, type: 'error' });
      });
    setIsMenuOpen(false);
  }, [setIsMenuOpen, auth, error, t]);

  return (
    <>
      <DrawerMask
        isDrawerOpen={isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
        zIndex={9}
      />
      <Menu theme={brandTheme} isMenuOpen={isMenuOpen}>
        <div>
          <span>
            <button onClick={() => setIsMenuOpen(false)}>
              <Close />
            </button>
          </span>
          <nav>
            {signedIn ? (
              <Link
                to={RoutesHashMap.Profile.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('myProfile')}
                <Profile />
              </Link>
            ) : null}
            {signedIn && location.pathname !== RoutesHashMap.Collection.path ? (
              <Link
                to={RoutesHashMap.Collection.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('myCollection')}
                <Collection />
              </Link>
            ) : null}
            {window.location.pathname === `/c/${slug}` &&
              details?.brand?.website && (
                <a
                  href={
                    details?.brand?.website?.includes('https://') ||
                    details?.brand?.website?.includes('http://')
                      ? details?.brand?.website
                      : `https://${details?.brand?.website}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => {
                    setIsMenuOpen(false);
                    logEvent({
                      eventType: 'ENGAGEMENTS',
                      event: 'WEBSITE_VISITS',
                      data: details?.brand,
                    });
                  }}
                >
                  {t('visitWebsite')}
                  <External />
                </a>
              )}
            {signedIn ? (
              <p onClick={handleLogoutButtonClicked}>
                {t('signOut')}
                {loading ? <LoadingIndicator /> : <Logout />}
              </p>
            ) : (
              <Link
                to={RoutesHashMap.Login.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('signIn')}
                <Logout />
              </Link>
            )}
          </nav>
          <span>
            <Image width='auto' src={brijLogo} alt='brij-logo' />
          </span>
        </div>
      </Menu>
    </>
  );
};

export default SideMenu;
