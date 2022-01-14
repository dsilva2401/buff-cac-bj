import { getAuth, User } from 'firebase/auth';
import usePersonalDetails from 'hooks/usePersonalDetails';
import useProductDetails from 'hooks/useProductDetails';
import React, { useCallback, useEffect, useState } from 'react';
import { useAPI } from 'utils/api';
import useCollection from '../../hooks/useCollection';
import { GlobalContext, PageStateType, TransitionType } from './GlobalContext';

const useUser = () => {
  const [authFetched, setAuthFetched] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [personalDetails, getPersonalDetails] = usePersonalDetails(user);

  useEffect(() => {
    const setUserToken = async () => {
      if (personalDetails) {
        const tokenExtracted = await user?.getIdToken() || null;
        setToken(tokenExtracted);
      }
    }

    setUserToken()
  }, [personalDetails, user, setToken]);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      setAuthFetched(true);
    });
  }, [setAuthFetched, setUser]);

  return {
    user,
    setUser,
    personalDetails,
    getPersonalDetails,
    authFetched,
    token
  }
}

export const GlobalProvider: React.FC = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signInRedirect, setSignInRedirect] = useState<string>(
    localStorage.getItem('signInRedirect') || ''
  );
  const [pageState, setPageState] = useState<PageStateType | null>(null);
  const [pageTransition, setPageTransition] = useState<TransitionType>('NONE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [appZoom, setAppZoom] = useState(1);
  const [previewEvent, setPreviewEvent] = useState({});

  const {
    user,
    personalDetails,
    getPersonalDetails,
    setUser,
    authFetched,
    token
  } = useUser();

  const [productDetails, reFetchProduct, productLoading] = useProductDetails(slug, token, previewEvent);
  const [collectionDetails, getCollection] = useCollection(token);

  const onActivateWarrantySuccess = useCallback(() => {
    reFetchProduct();
  }, [reFetchProduct]);

  const onActivateWarrantyError = useCallback((error) => {
    console.log(error);
  }, []);

  const [activateWarranty] = useAPI(
    {
      method: 'POST',
      endpoint: 'products/activateWarranty',
      onSuccess: onActivateWarrantySuccess,
      onError: onActivateWarrantyError,
    },
    token
  );

  useEffect(() => {
    if(window) {
      window.addEventListener("message", (event) => {
        setPreviewEvent({...event.data})
        if(event && event.data && event.data.type === 'enablePreview'){
          setIsPreviewMode(true);
          setAppZoom(event.data.zoom);
        }
      }, false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('signInRedirect', signInRedirect);
    // upon unmount clear storage
    return () => localStorage.setItem('signInRedirect', '');
  }, [signInRedirect]);

  return (
    <GlobalContext.Provider
      value={{
        previewEvent,
        setPreviewEvent,
        isPreviewMode,
        setIsPreviewMode,
        appZoom,
        setAppZoom,
        isMenuOpen,
        setIsMenuOpen,
        signInRedirect,
        setSignInRedirect,
        pageState,
        setPageState,
        pageTransition,
        setPageTransition,
        user,
        productDetails,
        loading: loading || productLoading,
        error,
        activateWarranty,
        slug,
        setSlug,
        setUser,
        personalDetails,
        collectionDetails,
        getCollection,
        authFetched,
        getPersonalDetails,
        token
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
