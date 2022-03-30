import React, { useCallback, useEffect, useState } from 'react';
import {
  GlobalContext,
  PageStateType,
  UserLocationType,
  ProductMapType,
} from './GlobalContext';
import { EventPayload } from '../../hooks/useLogEvent';
import { getAuth, User } from 'firebase/auth';
import { theme } from 'styles/theme';
import { useAPI } from 'utils/api';
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

  useEffect(() => {
    let pathCheck: boolean = false;
    if (
      window.location.pathname.includes(`c/${slug}`) ||
      window.location.pathname.includes(`*/${slug}`)
    )
      pathCheck = true;
    setBrandTheme(
      (pathCheck && localStorage.getItem('accentColor')) || theme.primary
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDetails, window.location.pathname, slug]);

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
    const THRESHOLD: number = 86400000; // 24 hours
    if (payload.event === 'USER_SCAN_A_TAG') {
      let currentTime: string = new Date().toString();
      let currentProduct: string = payload.data.replace(
        'https://v2.brij.it/c/',
        ''
      );

      // new product node
      let newProduct: ProductMapType = {
        slug: currentProduct,
        timeStamp: currentTime,
      };

      // get product map from localstorage
      let productScans: string | null = localStorage.getItem('productScanMap');
      let productScanMap: ProductMapType[];
      if (productScans) productScanMap = JSON.parse(productScans);
      else productScanMap = [];

      // purge older than time threshold nodes
      let productScanMapFiltered: ProductMapType[] = productScanMap.filter(
        (element) =>
          new Date().getTime() - new Date(element.timeStamp).getTime() <
          THRESHOLD
      );

      // find if scanned product exists
      let index = productScanMapFiltered.findIndex(
        (node) => node.slug === currentProduct
      );

      if (index > -1) {
        // if slug exists already
        let timeDifference =
          new Date().getTime() -
          new Date(productScanMapFiltered[index].timeStamp).getTime();
        if (timeDifference > THRESHOLD) {
          // if enough time has passed since last scan
          productScanMapFiltered.splice(index, 1, newProduct);
          localStorage.setItem(
            'productScanMap',
            JSON.stringify(productScanMapFiltered)
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
          // if enough time has not passed since last scan
          localStorage.setItem(
            'productScanMap',
            JSON.stringify(productScanMapFiltered)
          );
          return undefined;
        }
      } else {
        // if slug is uniquely new
        productScanMapFiltered.push(newProduct);
        localStorage.setItem(
          'productScanMap',
          JSON.stringify(productScanMapFiltered)
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
