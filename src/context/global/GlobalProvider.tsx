import { getAuth, User } from 'firebase/auth';
import usePersonalDetails from 'hooks/usePersonalDetails';
import useProductDetails from 'hooks/useProductDetails';
import React, { useCallback, useEffect, useState } from 'react';
import { useAPI } from 'utils/api';
import useCollection from '../../hooks/useCollection';
import { GlobalContext, PageStateType, TransitionType } from './GlobalContext';

export const GlobalProvider: React.FC = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authFetched, setAuthFetched] = useState<boolean>(false);
  const [signInRedirect, setSignInRedirect] = useState<string>(
    localStorage.getItem('signInRedirect') || ''
  );
  const [pageState, setPageState] = useState<PageStateType | null>(null);
  const [pageTransition, setPageTransition] = useState<TransitionType>('NONE');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);

  const [personalDetails, getPersonalDetails] = usePersonalDetails(user);
  const [productDetails, reFetchProduct, productLoading] = useProductDetails(slug, user);
  const [collectionDetails, getCollection] = useCollection(user);

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
    user
  );

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

  useEffect(() => {
    localStorage.setItem('signInRedirect', signInRedirect);
    // upon unmount clear storage
    return () => localStorage.setItem('signInRedirect', '');
  }, [signInRedirect]);

  return (
    <GlobalContext.Provider
      value={{
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
        getPersonalDetails
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
