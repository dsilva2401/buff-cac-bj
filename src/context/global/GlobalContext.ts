import React, { createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { UserStruct } from 'types/User';
import { EventPayload } from '../../hooks/useLogEvent';
import { ProductDetailsType } from '../../types/ProductDetailsType';
import { MAGIC_ACTION } from './GlobalProvider';

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
  appTheme: string;
  setAppTheme: React.Dispatch<React.SetStateAction<string>>;
  appZoom: number;
  setAppZoom: React.Dispatch<React.SetStateAction<number>>;
  previewEvent: any;
  setPreviewEvent: React.Dispatch<React.SetStateAction<any>>;
  previewAuthenticated: any;
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
  retractDrawer: boolean;
  setRetractDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  logEvent: (
    payload: Pick<EventPayload, 'event' | 'eventType' | 'moduleType' | 'data'>
  ) => Promise<any>;
  magicAction: MAGIC_ACTION,
  setMagicAction: (magicAction: MAGIC_ACTION) => void,
  magicPayload: any,
  setMagicPayload: (payload: any) => void
};

export const GlobalContext = createContext<GlobalContextProps>({
  isPreviewMode: false,
  setIsPreviewMode: () => {},
  appTheme: '',
  setAppTheme: () => {},
  appZoom: 1,
  setAppZoom: () => {},
  previewEvent: {},
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
  error: null,
  activateWarranty: () => new Promise((res, rej) => res()),
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
  setMagicAction: (magicAction: MAGIC_ACTION) => {},
  magicPayload: {},
  setMagicPayload: (payload: any) => {}
});

export const useGlobal = () => useContext(GlobalContext);
