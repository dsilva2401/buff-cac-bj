import { User } from "firebase/auth";
import React, { createContext, useContext } from "react";
import { UserStruct } from "types/User";
import { ProductDetailsType } from "../../types/ProductDetailsType";

export type ThemeType = {
  button: {
    primary: string;
    secondary: string;
  };
  background: string;
};

export const lightTheme: ThemeType = {
  button: {
    primary: "#000",
    secondary: "#fff",
  },
  background: "#fef",
};

export const darkTheme: ThemeType = {
  button: {
    primary: "#fff",
    secondary: "#000",
  },
  background: "#000",
};

export type ThemeMode = "dark" | "light";

export type PageStateType = {
  currentPage: number;
  isDrawerOpen: boolean;
  pageTitle: string;
} | null;

export type GlobalContextProps = {
  isMenuOpen: boolean;
  theme: ThemeMode;
  lightTheme: ThemeType;
  darkTheme: ThemeType;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTheme: React.Dispatch<React.SetStateAction<ThemeMode>>;
  signInRedirect: string;
  setSignInRedirect: React.Dispatch<React.SetStateAction<string>>;
  pageState: PageStateType | null;
  setPageState: React.Dispatch<React.SetStateAction<PageStateType | null>>;
  user: User | null;
  personDetails: UserStruct | null;
  productDetails: ProductDetailsType | null;
  activateWarranty: ({
    warrantyId
  }: { warrantyId: string}) => Promise<void>;
  loading: boolean;
  error: string | null;
  slug: string | null;
  setSlug: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
};

export const GlobalContext = createContext<GlobalContextProps>({
  isMenuOpen: false,
  theme: "light",
  lightTheme: { ...lightTheme },
  darkTheme: { ...darkTheme },
  setIsMenuOpen: () => {},
  setTheme: () => {},
  signInRedirect: "",
  setSignInRedirect: () => {},
  pageState: null,
  setPageState: () => {},
  user: null,
  personDetails: null,
  productDetails: null,
  loading: false,
  error: null,
  activateWarranty: () => new Promise((res, rej) => res()),
  slug: null,
  setSlug: () => {},
  setUser: () => {},
});

export const useGlobal = () => useContext(GlobalContext);
