import React, { useState, useEffect, useCallback } from 'react';
import { GlobalContext, UserLocationType } from './GlobalContext';
import { theme } from 'styles/theme';
import { EventPayload } from '../../hooks/useLogEvent';
import useProductDetails from 'hooks/useProductDetails';
import useCollection from '../../hooks/useCollection';
import useLogEvent from 'hooks/useLogEvent';
import useUser from 'hooks/useUser';
import { ModuleInfoType } from 'types/ProductDetailsType';

export enum MAGIC_ACTION {
  OPEN_MODULE = 'OPEN_MODULE',
  REDIRECT = 'REDIRECT',
}

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
  const [productModule, setProductModule] = useState<string>('');
  const [redirectResolved, setRedirectResolved] = useState<boolean>(false);
  const [formRegistration, setFormRegistration] =
    useState<ModuleInfoType | null>(null);

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
    setToken,
  } = useUser();

  const [productDetails, reFetchProduct, productLoading, setProductDetails] =
    useProductDetails(slug, token, previewEvent, authFetched);
  const [collectionDetails, getCollection] = useCollection(token);

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

  const logEvent = useCallback(
    (
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
        if (localStorage.getItem('storedScans')) {
          scanMap = new Map(
            JSON.parse(localStorage.getItem('storedScans') || '{}')
          );
        } else scanMap = new Map<string, string>();

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
    },
    [_logEvent, productDetails, user, userLocation]
  );

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
        redirectResolved,
        setRedirectResolved,
        setToken,
        formRegistration,
        setFormRegistration,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
