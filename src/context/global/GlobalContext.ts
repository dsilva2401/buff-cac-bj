import React, { createContext, useContext } from 'react';
import { ProductDetailsType } from '../../types/ProductDetailsType';
import { EventPayload } from '../../hooks/useLogEvent';
import { MAGIC_ACTION } from './GlobalProvider';
import { UserStruct } from 'types/User';
import { User } from 'firebase/auth';

export type PageStateType = {
  currentPage: number;
  isDrawerOpen: boolean;
  pageTitle: string;
} | null;

export type UserLocationType = {
  latitude: number;
  longitude: number;
};

export type GlobalContextProps = {
  isMenuOpen: boolean;
  isPreviewMode: boolean;
  setIsPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  brandTheme: string;
  setBrandTheme: React.Dispatch<React.SetStateAction<string>>;
  appZoom: number;
  setAppZoom: React.Dispatch<React.SetStateAction<number>>;
  previewEvent: MessageEvent | null;
  setPreviewEvent: React.Dispatch<React.SetStateAction<MessageEvent | null>>;
  previewAuthenticated: boolean;
  setPreviewAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userLocation: UserLocationType;
  setUserLocation: React.Dispatch<React.SetStateAction<UserLocationType>>;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  signInRedirect: string;
  setSignInRedirect: React.Dispatch<React.SetStateAction<string>>;
  pageState: PageStateType | null;
  setPageState: React.Dispatch<React.SetStateAction<PageStateType | null>>;
  user: User | null;
  personalDetails: UserStruct | null;
  productDetails: ProductDetailsType | null;
  collectionDetails: ProductDetailsType[];
  reFetchProduct: () => void;
  loading: boolean;
  slug: string | null;
  setSlug: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getCollection: () => void;
  authFetched: boolean;
  getPersonalDetails: () => void;
  token: string | null;
  retractDrawer: boolean;
  setRetractDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  logEvent: (
    payload: Pick<
      EventPayload,
      'event' | 'eventType' | 'moduleType' | 'moduleId' | 'data'
    >
  ) => Promise<any> | undefined;
  magicAction: MAGIC_ACTION;
  setMagicAction: React.Dispatch<React.SetStateAction<MAGIC_ACTION>>;
  magicPayload: any;
  setMagicPayload: React.Dispatch<React.SetStateAction<any>>;
  agegateDisplay: boolean;
  toggleAgegateDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  collapsedDrawerHeight: number;
  setCollapsedDrawerHeight: React.Dispatch<React.SetStateAction<number>>;
  productModule: string;
  setProductModule: React.Dispatch<React.SetStateAction<string>>;
  alreadySignedIn: boolean;
  setAlreadySignIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalContext = createContext<GlobalContextProps>({
  isPreviewMode: false,
  setIsPreviewMode: () => {},
  brandTheme: '',
  setBrandTheme: () => {},
  appZoom: 1,
  setAppZoom: () => {},
  previewEvent: null,
  setPreviewEvent: () => {},
  previewAuthenticated: false,
  setPreviewAuthenticated: () => {},
  userLocation: { latitude: 0, longitude: 0 },
  setUserLocation: () => {},
  isMenuOpen: false,
  setIsMenuOpen: () => {},
  signInRedirect: '',
  setSignInRedirect: () => {},
  pageState: null,
  setPageState: () => {},
  user: null,
  personalDetails: null,
  productDetails: null,
  collectionDetails: [],
  loading: false,
  reFetchProduct: () => {},
  slug: null,
  setSlug: () => {},
  setUser: () => {},
  getCollection: () => {},
  authFetched: false,
  getPersonalDetails: () => {},
  token: null,
  retractDrawer: false,
  setRetractDrawer: () => {},
  logEvent: () => new Promise((res, rej) => {}),
  magicAction: MAGIC_ACTION.REDIRECT,
  setMagicAction: () => {},
  magicPayload: {},
  setMagicPayload: () => {},
  agegateDisplay: false,
  toggleAgegateDisplay: () => {},
  collapsedDrawerHeight: 0,
  setCollapsedDrawerHeight: () => {},
  productModule: '',
  setProductModule: () => {},
  alreadySignedIn: true,
  setAlreadySignIn: () => {},
});

export const useGlobal = () => useContext(GlobalContext);
