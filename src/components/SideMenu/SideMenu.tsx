import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGlobal } from '../../context/global/GlobalContext';
import { Link, useLocation } from 'react-router-dom';
import { showToast } from 'components/Toast/Toast';
import { getAuth, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { RoutesHashMap } from 'routes';
import { useAPI } from 'utils/api';
import { ReactComponent as LoadingIndicator } from 'assets/icons/svg/loading-small.svg';
import { ReactComponent as Collection } from 'assets/icons/svg/collection.svg';
import { ReactComponent as Close } from 'assets/icons/svg/close-white.svg';
import { ReactComponent as External } from 'assets/icons/svg/external.svg';
import { ReactComponent as Logout } from 'assets/icons/svg/log-out.svg';
import { ReactComponent as Profile } from 'assets/icons/svg/person.svg';
import { ReactComponent as LogIn } from 'assets/icons/svg/log-in.svg';
import { ReactComponent as Trash } from 'assets/icons/svg/trash.svg';
import poweredByLogo from 'assets/images/svg/powered-by.svg';
import brijLogo from 'assets/logos/svg/brij.svg';
import DrawerMask from 'components/DrawerMask';
import Image from 'components/Image';
import Menu from './styles';
import { useAPICacheContext } from 'context/APICacheContext/APICacheContext';

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
    isPreviewMode,
  } = useGlobal();

  const { t } = useTranslation('translation', { keyPrefix: 'sideMenu' });
  const previousUser = usePrevious(user);
  const location = useLocation();
  const history = useHistory();
  const auth = getAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { invalidateCache } = useAPICacheContext();

  const userToUse = isPreviewMode ? null : user;

  useEffect(() => {
    if (isPreviewMode) {
      return;
    }

    if (previousUser && !user) {
      history.push(RoutesHashMap.Login.path);
    }
  }, [previousUser, user, history, isPreviewMode]);

  const handleLogoutButtonClicked = useCallback(() => {
    if (error !== '') setError('');
    setSlug(null);
    setLoading(true);
    signOut(auth)
      .then(() => {
        setLoading(false);
        showToast({ message: t('signOutToastMessage'), type: 'success' });
        invalidateCache();
      })
      .catch((error) => {
        showToast({ message: error.message, type: 'error' });
      });
    setIsMenuOpen(false);
  }, [setIsMenuOpen, auth, error, t, setSlug, invalidateCache]);

  const redirectToCollection = useCallback(() => {
    invalidateCache();
    history.push(RoutesHashMap.Collection.path);
    showToast({
      message: `${
        details?.product?.name || slug
      } has been removed from your collection.`,
      type: 'success',
    });
    setSlug(null);
    setIsMenuOpen(false);
  }, [
    history,
    setIsMenuOpen,
    setSlug,
    details?.product?.name,
    slug,
    invalidateCache,
  ]);

  const onRemoveProductError = (error: any) => {
    showToast({ message: error.message, type: 'error' });
    setIsMenuOpen(false);
  };

  const [removeProduct] = useAPI({
    endpoint: 'user/remove_product',
    method: 'DELETE',
    onSuccess: redirectToCollection,
    onError: onRemoveProductError,
  });

  // Assuming if the product is registered to the user it should be in user collection
  // In the future maybe decrease the payload size of collection API call and match collection items
  const showRemoveProductButton =
    details?.product?.registeredToCurrentUser &&
    window.location.pathname === `/c/${slug}`;

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
            <button
              onClick={() => setIsMenuOpen(false)}
              className='close-right-panel-btn'
            >
              <Close />
            </button>
          </span>
          <nav>
            {userToUse ? (
              <Link
                className='go-to-my-profile'
                to={RoutesHashMap.Profile.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('myProfile')}
                <Profile />
              </Link>
            ) : null}
            {userToUse &&
            location.pathname !== RoutesHashMap.Collection.path ? (
              <Link
                className='go-to-my-collection'
                to={RoutesHashMap.Collection.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('myCollection')}
                <Collection />
              </Link>
            ) : null}
            {showRemoveProductButton && (
              <p
                className='remove-from-my-collection'
                onClick={() =>
                  removeProduct({
                    tag: slug,
                  })
                }
              >
                Remove Product
                <Trash />
              </p>
            )}
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
                  className='go-to-website'
                  onClick={() => {
                    setIsMenuOpen(false);
                    logEvent({
                      eventType: 'ENGAGEMENTS',
                      event: 'WEBSITE_VISITS',
                      data: {
                        ...details?.brand,
                        url:
                          details?.brand?.website?.includes('https://') ||
                          details?.brand?.website?.includes('http://')
                            ? details?.brand?.website
                            : `https://${details?.brand?.website}`,
                      },
                    });
                  }}
                >
                  {t('visitWebsite')}
                  <External />
                </a>
              )}
            {userToUse ? (
              <p className='sign-out' onClick={handleLogoutButtonClicked}>
                {t('signOut')}
                {loading ? <LoadingIndicator /> : <Logout />}
              </p>
            ) : (
              <Link
                className='sign-in'
                to={isPreviewMode ? `/c/${slug}` : RoutesHashMap.Login.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('signIn')}
                <LogIn />
              </Link>
            )}
          </nav>
          <span>
            {window.location.pathname === `/c/${slug}` && (
              <Image
                width='111px'
                src={poweredByLogo}
                alt='powered-by'
                padding='10px 8px 0 0'
              />
            )}
            <Image
              width={
                window.location.pathname === `/c/${slug}` ? '48px' : 'auto'
              }
              src={brijLogo}
              alt='brij-logo'
            />
          </span>
        </div>
      </Menu>
    </>
  );
};

export default SideMenu;
