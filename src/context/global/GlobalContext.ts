import { User } from "firebase/auth";
import React, { createContext, useContext } from "react";
import { UserStruct } from "types/User";
import { ProductDetailsType } from "../../types/ProductDetailsType";

export type PageStateType = {
  currentPage: number;
  isDrawerOpen: boolean;
  pageTitle: string;
} | null;

export type GlobalContextProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  signInRedirect: string;
  setSignInRedirect: React.Dispatch<React.SetStateAction<string>>;
  pageState: PageStateType | null;
  setPageState: React.Dispatch<React.SetStateAction<PageStateType | null>>;
  user: User | null;
  personDetails: UserStruct | null;
  productDetails: ProductDetailsType | null;
  activateWarranty: ({
    warrantyId,
    tag
  }: { warrantyId: string, tag: string | null }) => Promise<void>;
  loading: boolean;
  error: string | null;
  slug: string | null;
  setSlug: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const GlobalContext = createContext<GlobalContextProps>({
  isMenuOpen: false,
  setIsMenuOpen: () => { },
  signInRedirect: "",
  setSignInRedirect: () => { },
  pageState: null,
  setPageState: () => { },
  user: null,
  personDetails: null,
  productDetails: null,
  loading: false,
  error: null,
  activateWarranty: () => new Promise((res, rej) => res()),
  slug: null,
  setSlug: () => { },
  setUser: () => { },
});

export const useGlobal = () => useContext(GlobalContext);
