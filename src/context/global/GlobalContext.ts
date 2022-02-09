import { User } from 'firebase/auth';
import React, { createContext, useContext } from 'react';
import { UserStruct } from 'types/User';
import { EventPayload } from '../../hooks/useLogEvent';
import { ProductDetailsType } from '../../types/ProductDetailsType';

export type PageStateType = {
  currentPage: number;
  isDrawerOpen: boolean;
  pageTitle: string;
} | null;

export type GlobalContextProps = {
  isMenuOpen: boolean;
  isPreviewMode: boolean;
  setIsPreviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  appZoom: number;
  setAppZoom: React.Dispatch<React.SetStateAction<number>>;
  previewEvent: any;
  setPreviewEvent: React.Dispatch<React.SetStateAction<any>>;
  previewAuthenticated: any;
  setPreviewAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
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
};

export const GlobalContext = createContext<GlobalContextProps>({
  isPreviewMode: false,
  setIsPreviewMode: () => {},
  appZoom: 1,
  setAppZoom: () => {},
  previewEvent: {},
  setPreviewEvent: () => {},
  previewAuthenticated: false,
  setPreviewAuthenticated: () => {},
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
});

export const useGlobal = () => useContext(GlobalContext);
