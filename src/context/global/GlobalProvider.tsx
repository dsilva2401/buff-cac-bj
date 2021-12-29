import { getAuth, User } from "firebase/auth";
import usePersonDetails from "hooks/usePersonalDetails";
import useProductDetails from "hooks/useProductDetails";
import React, { useCallback, useEffect, useState } from "react";
import { useAPI } from "utils/api";
import {
  darkTheme,
  GlobalContext,
  lightTheme,
  PageStateType,
  ThemeMode,
} from "./GlobalContext";

export const GlobalProvider: React.FC = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [signInRedirect, setSignInRedirect] = useState<string>(
    localStorage.getItem("signInRedirect") || ""
  );
  const [pageState, setPageState] = useState<PageStateType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);

  const personDetails = usePersonDetails(user);
  const [productDetails, reFetchProduct] = useProductDetails(slug, user);

  const onActivateWarrantySuccess = useCallback(() => {
    reFetchProduct();
  }, [reFetchProduct]);

  const onActivateWarrantyError = useCallback((error) => {
    console.log(error)
  }, []);

  const [activateWarranty] = useAPI({
    method: 'POST',
    endpoint: 'products/activateWarranty',
    onSuccess: onActivateWarrantySuccess,
    onError: onActivateWarrantyError,
  }, user);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('signInRedirect', signInRedirect);
    // upon unmount clear storage
    return () => localStorage.setItem("signInRedirect", "");
  }, [signInRedirect]);

  return (
    <GlobalContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        theme,
        lightTheme,
        darkTheme,
        setTheme,
        signInRedirect,
        setSignInRedirect,
        pageState,
        setPageState,
        user,
        productDetails,
        loading,
        error,
        activateWarranty,
        slug,
        setSlug,
        setUser,
        personDetails
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
