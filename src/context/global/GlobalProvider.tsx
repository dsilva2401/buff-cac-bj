import { getAuth, User } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import { ProductDetailsType } from "../../types/ProductDetailsType";
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
  const [signInRedirect, setSignInRedirect] = useState<string>("");
  const [pageState, setPageState] = useState<PageStateType | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [productDetails, setProductDetails] =
    useState<ProductDetailsType | null>(null);

  const getProductDetails = useCallback(
    async (slug: string, token?: string) => {
      try {
        setLoading(true);
        let res: Response | null = null;
        const url = `https://damp-wave-40564.herokuapp.com/products/${slug}`;
        if (token) {
          console.log("WITH TOKEN");
          res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          console.log("WITHOUT TOKEN");
          res = await fetch(url);
        }
        const resJson = await res.json();
        setProductDetails(resJson);
      } catch (e) {
        setError(JSON.stringify(e));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const activateWarranty = useCallback(
    async (warrantyId: string) => {
      try {
        console.log("ACTIVATE TRIGGER")
        setLoading(true);
        const token = await user!.getIdToken();

        // const res = await fetch(
        //   "https://damp-wave-40564.herokuapp.com/products/activateWarranty",
        //   {
        //     method: "POST",
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //     body: JSON.stringify({ warrantyId }),
        //   }
        // );
        // if (res.status !== 200) {
        //   throw new Error("Error activating warranty");
        // }
        // // refetch data to show updated state
        // // TODO: use optimistic UI
        getProductDetails(slug!, token);
      } catch (e) {
        setError(JSON.stringify(e));
      }
      finally{
        setLoading(false);
      }
    },
    [user, slug, getProductDetails]
  );

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("userId: ", user.uid);
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    const refetchProductDetails = async () => {
      const token = await user!.getIdToken();
      getProductDetails(slug!, token);
    };
    if (slug && !user) {
      getProductDetails(slug);
    } else if (slug && user) {
      refetchProductDetails();
    }
  }, [slug, user, getProductDetails]);

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
        getProductDetails,
        loading,
        error,
        activateWarranty,
        slug,
        setSlug,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
