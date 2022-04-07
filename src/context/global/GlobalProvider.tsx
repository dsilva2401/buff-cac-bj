import React, { useCallback, useEffect, useState } from 'react';
import {
  GlobalContext,
  PageStateType,
  UserLocationType,
} from './GlobalContext';
import { useAPI } from 'utils/api';
import { theme } from 'styles/theme';
import { getAuth, User } from 'firebase/auth';
import { EventPayload } from '../../hooks/useLogEvent';
import usePersonalDetails from 'hooks/usePersonalDetails';
import useProductDetails from 'hooks/useProductDetails';
import useCollection from '../../hooks/useCollection';
import useLogEvent from 'hooks/useLogEvent';

export enum MAGIC_ACTION {
  OPEN_MODULE = 'OPEN_MODULE',
  REDIRECT = 'REDIRECT',
}

const useUser = () => {
  const [authFetched, setAuthFetched] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [personalDetails, getPersonalDetails, token] = usePersonalDetails(user);

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      if (user) setUser(user);
      else setUser(null);
      setAuthFetched(true);
    });
  }, [setAuthFetched, setUser]);

  return {
    user,
    setUser,
    personalDetails,
    getPersonalDetails,
    authFetched,
    token,
  };
};

export const GlobalProvider: React.FC = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signInRedirect, setSignInRedirect] = useState<string>(
    localStorage.getItem('signInRedirect') || ''
  );
  const [retractDrawer, setRetractDrawer] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocationType>({
    latitude: 0,
    longitude: 0,
  });
  const [pageState, setPageState] = useState<PageStateType | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [appZoom, setAppZoom] = useState(1);
  const [previewEvent, setPreviewEvent] = useState({});
  const [previewAuthenticated, setPreviewAuthenticated] = useState(false);
  const [magicAction, setMagicAction] = useState<MAGIC_ACTION>(
    MAGIC_ACTION.REDIRECT
  );
  const [agegateDisplay, toggleAgegateDisplay] = useState<boolean>(false);
  const [magicPayload, setMagicPayload] = useState<any>({});
  const [brandTheme, setBrandTheme] = useState<string>(
    localStorage.getItem('accentColor') || theme.primary
  );

  const {
    user,
    personalDetails,
    getPersonalDetails,
    setUser,
    authFetched,
    token,
  } = useUser();

  const [productDetails, reFetchProduct, productLoading] = useProductDetails(
    slug,
    token,
    previewEvent
  );
  const [collectionDetails, getCollection] = useCollection(token);
  const [collapsedDrawerHeight, setCollapsedDrawerHeight] = useState<number>(0);

  const pathname: string = window.location.pathname;

  useEffect(() => {
    let pathCheck: boolean = false;
    if (pathname.includes(`c/${slug}`)) pathCheck = true;
    setBrandTheme(
      (pathCheck && localStorage.getItem('accentColor')) || theme.primary
    );
  }, [productDetails, pathname, slug]);

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

  const onRegisterProductSuccess = useCallback(() => {
    reFetchProduct();
  }, [reFetchProduct]);

  const onRegisterProductError = useCallback((error) => {
    console.log(error);
  }, []);

  const [registerProduct] = useAPI(
    {
      method: 'POST',
      endpoint: `products/register/${slug}`,
      onSuccess: onRegisterProductSuccess,
      onError: onRegisterProductError,
    },
    token
  );

  useEffect(() => {
    if (window) {
      window.addEventListener(
        'message',
        (event) => {
          setPreviewEvent({ ...event.data });
          if (event && event.data && event.data.type === 'enablePreview') {
            setIsPreviewMode(true);
            setAppZoom(event.data.zoom);
          }
          if (event && event.data && event.data.type === 'setAuthState') {
            setPreviewAuthenticated(event.data.data);
          }
        },
        false
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('signInRedirect', signInRedirect);
    // upon unmount clear storage
    return () => localStorage.setItem('signInRedirect', '');
  }, [signInRedirect]);

  const _logEvent = useLogEvent();

  const logEvent = (
    payload: Pick<EventPayload, 'event' | 'eventType' | 'moduleType' | 'data'>
  ) => {
    const LAST_SCAN_INTERVAL_THRESHOLD: number = 3600000; // 1 hour
    const SCAN_MAP_ENTRIES_THRESHOLD: number = 100; // 100 entries
    const SCAN_MAP_TIME_THRESHOLD: number = 86400000; // 24 hours
    if (payload.event === 'USER_SCAN_A_TAG') {
      let scanTime: string = new Date().toString();
      let scanSlug: string = payload.data;

      // Get product map from localstorage
      let scanMap: Map<string, string> | null;
      if (localStorage.getItem('storedScans'))
        scanMap = new Map(
          JSON.parse(localStorage.getItem('storedScans') || '{}')
        );
      else scanMap = new Map<string, string>();

      // Purge older than threshold entries
      for (let [key, value] of scanMap) {
        if (
          new Date().getTime() - new Date(value).getTime() >
          SCAN_MAP_TIME_THRESHOLD
        )
          scanMap.delete(key);
      }

      // Purge the map if entries equal to length threshold
      if (scanMap.size >= SCAN_MAP_ENTRIES_THRESHOLD) scanMap.clear();

      if (scanMap instanceof Map) {
        // find if scanned product exists
        if (scanMap.has(scanSlug)) {
          let timestamp: string = scanMap.get(scanSlug) || '';
          // if time threshold has passed since last scan
          if (
            timestamp &&
            new Date().getTime() - new Date(timestamp).getTime() >
              LAST_SCAN_INTERVAL_THRESHOLD
          ) {
            // update entry with new timestamp and log the event
            scanMap.set(scanSlug, scanTime);
            localStorage.setItem(
              'storedScans',
              JSON.stringify(Array.from(scanMap.entries()))
            );
            return _logEvent({
              ...payload,
              user: user?.uid,
              location: userLocation,
              product: productDetails?.product.id,
              tag: productDetails?.tag.slug,
              brand: productDetails?.brand.id,
            });
          } else {
            localStorage.setItem(
              'storedScans',
              JSON.stringify(Array.from(scanMap.entries()))
            );
            return undefined;
          }
        } else {
          // if slug is uniquely new
          scanMap.set(scanSlug, scanTime);
          // Save map into localstorage
          localStorage.setItem(
            'storedScans',
            JSON.stringify(Array.from(scanMap.entries()))
          );
          // console.log('UPDATED SCAN MAP: ', scanMap);
          return _logEvent({
            ...payload,
            user: user?.uid,
            location: userLocation,
            product: productDetails?.product.id,
            tag: productDetails?.tag.slug,
            brand: productDetails?.brand.id,
          });
        }
      }
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        previewEvent,
        setPreviewEvent,
        isPreviewMode,
        setIsPreviewMode,
        brandTheme,
        setBrandTheme,
        appZoom,
        setAppZoom,
        previewAuthenticated,
        setPreviewAuthenticated,
        userLocation,
        setUserLocation,
        isMenuOpen,
        setIsMenuOpen,
        signInRedirect,
        setSignInRedirect,
        pageState,
        setPageState,
        user,
        productDetails,
        loading: productLoading,
        activateWarranty,
        registerProduct,
        slug,
        setSlug,
        setUser,
        personalDetails,
        collectionDetails,
        getCollection,
        authFetched,
        getPersonalDetails,
        token,
        retractDrawer,
        setRetractDrawer,
        logEvent,
        magicAction,
        setMagicAction,
        magicPayload,
        setMagicPayload,
        agegateDisplay,
        toggleAgegateDisplay,
        collapsedDrawerHeight,
        setCollapsedDrawerHeight,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
