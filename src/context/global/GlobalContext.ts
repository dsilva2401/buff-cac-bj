import { User } from 'firebase/auth';
import React, { createContext, useContext } from 'react';
import { UserStruct } from 'types/User';
import { ProductDetailsType } from '../../types/ProductDetailsType';

export type PageStateType = {
  currentPage: number;
  isDrawerOpen: boolean;
  pageTitle: string;
} | null;

export type TransitionType = 'LEFT' | 'RIGHT' | 'NONE';

export type GlobalContextProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  signInRedirect: string;
  setSignInRedirect: React.Dispatch<React.SetStateAction<string>>;
  pageState: PageStateType | null;
  setPageState: React.Dispatch<React.SetStateAction<PageStateType | null>>;
  pageTransition: TransitionType;
  setPageTransition: React.Dispatch<React.SetStateAction<TransitionType>>;
  user: User | null;
  personalDetails: UserStruct | null;
  productDetails: ProductDetailsType | null;
  collectionDetails: ProductDetailsType[];
  activateWarranty: ({
    warrantyId,
    tag,
  }: {
    warrantyId: string;
    tag: string | null;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
  slug: string | null;
  setSlug: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getCollection: () => void;
  authFetched: Boolean;
  getPersonalDetails: () => void;
  token: string | null;
};

export const GlobalContext = createContext<GlobalContextProps>({
  isMenuOpen: false,
  setIsMenuOpen: () => { },
  signInRedirect: '',
  setSignInRedirect: () => { },
  pageState: null,
  setPageState: () => { },
  pageTransition: 'NONE',
  setPageTransition: () => { },
  user: null,
  personalDetails: null,
  productDetails: null,
  collectionDetails: [],
  loading: false,
  error: null,
  activateWarranty: () => new Promise((res, rej) => res()),
  slug: null,
  setSlug: () => { },
  setUser: () => { },
  getCollection: () => { },
  authFetched: false,
  getPersonalDetails: () => { },
  token: null
});

export const useGlobal = () => useContext(GlobalContext);
