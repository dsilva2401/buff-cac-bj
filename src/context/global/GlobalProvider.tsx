import React, { useState, useEffect } from 'react';
import { useGlobal, GlobalContext, UserLocationType } from './GlobalContext';
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
  const { isPreviewMode } = useGlobal();

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged(async (user) => {
      // document.location.href is a hack until we find a better solution
      // because this code runs even before we get a chance to set isPreviewMode.
      // maybe because firebase store user information in localStorage and triggers this very quickly.
      if (
        !isPreviewMode &&
        document.location.href.split('/').pop() !== '1234'
      ) {
        if (user) setUser(user);
        else setUser(null);
        setAuthFetched(true);
      }
    });
  }, [setAuthFetched, setUser, isPreviewMode]);

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
  const [registeringProduct, setRegisteringProduct] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserLocationType>({
    latitude: 0,
    longitude: 0,
  });
  const [slug, setSlug] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [appZoom, setAppZoom] = useState(1);
  const [previewEvent, setPreviewEvent] = useState<MessageEvent | null>(null);
  const [previewAuthenticated, setPreviewAuthenticated] = useState(false);
  const [magicAction, setMagicAction] = useState<MAGIC_ACTION>(
    MAGIC_ACTION.REDIRECT
  );
  const [agegateDisplay, toggleAgegateDisplay] = useState<boolean>(false);
  const [magicPayload, setMagicPayload] = useState<any>({});
  const [brandTheme, setBrandTheme] = useState<string>(
    localStorage.getItem('accentColor') || theme.primary
  );
  const [autoDeployTriggered, setAutoDeployTriggered] =
    React.useState<boolean>(false);
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [productModule, setProductModule] = useState<string>('');

  // by default we keep alreadySignedIn true
  // because even if the user was not signed in
  // authdrawer open event will set the alreadySignedIn to false
  const [alreadySignedIn, setAlreadySignIn] = useState<boolean>(true);

  const {
    user,
    personalDetails,
    getPersonalDetails,
    setUser,
    authFetched,
    token,
  } = useUser();

  const [productDetails, reFetchProduct, productLoading, setProductDetails] =
    useProductDetails(slug, token, previewEvent);
  const [collectionDetails, getCollection] = useCollection(token);
  const [collapsedDrawerHeight, setCollapsedDrawerHeight] = useState<number>(0);

  const pathname: string = window.location.pathname;

  const onBackButtonEvent = () => {
    setBrandTheme(localStorage.getItem('accentColor') || theme.primary);
  };

  useEffect(() => {
    if (slug) setAutoDeployTriggered(false);
  }, [slug]);
  useEffect(() => {
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);
    };
  }, []);

  useEffect(() => {
    if (productDetails) {
      window.sessionStorage.setItem(
        'brijProductDetails',
        JSON.stringify(productDetails)
      );
    }
    let pathCheck: boolean = false;
    if (pathname.includes(`c/${slug}`)) pathCheck = true;
    setBrandTheme(
      (pathCheck && localStorage.getItem('accentColor')) || theme.primary
    );
  }, [productDetails, pathname, slug]);

  useEffect(() => {
    if (window) {
      window.addEventListener(
        'message',
        (event: MessageEvent) => {
          setPreviewEvent({ ...event.data });
          if (event && event.data && event.data.type === 'enablePreview') {
            setIsPreviewMode(true);
            setSignedIn(false);
            setUser(null);
            setAppZoom(event.data.zoom);
            let style = document.getElementById('setZoomStyleForDropdowns');
            if (!style) {
              style = document.createElement('style');
            }
            style.setAttribute('id', 'setZoomStyleForDropdowns');
            style.innerText =
              '.MuiPopover-root{zoom: ' +
              event.data.zoom +
              '; } .MuiPaper-root { left: 7% !important}';
            window.document.body.appendChild(style);
          }
          if (event && event.data && event.data.type === 'setAuthState') {
            setPreviewAuthenticated(event.data.data);
          }
        },
        false
      );
    }
  }, [setUser]);

  useEffect(() => {
    try {
      if (isPreviewMode) {
        window.parent.postMessage(
          { type: 'setAuthState', data: previewAuthenticated },
          '*'
        );
      }
    } catch (e) {}
  }, [previewAuthenticated, isPreviewMode]);

  useEffect(() => {
    localStorage.setItem('signInRedirect', signInRedirect);
    // upon unmount clear storage
    return () => localStorage.setItem('signInRedirect', '');
  }, [signInRedirect]);

  const _logEvent = useLogEvent();

  const logEvent = (
    payload: Pick<
      EventPayload,
      'event' | 'eventType' | 'moduleType' | 'moduleId' | 'data'
    >
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
    } else {
      return _logEvent({
        ...payload,
        user: user?.uid,
        location: userLocation,
        product: productDetails?.product.id,
        tag: productDetails?.tag.slug,
        brand: productDetails?.brand.id,
      });
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
        user,
        productDetails,
        loading: productLoading,
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
        autoDeployTriggered,
        setAutoDeployTriggered,
        productModule,
        setProductModule,
        alreadySignedIn,
        setAlreadySignIn,
        reFetchProduct,
        setProductDetails,
        setRegisteringProduct,
        registeringProduct,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
