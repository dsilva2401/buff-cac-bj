import { useLayoutEffect, useEffect } from 'react';
import { isBrowser } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import { useGlobal } from './context/global/GlobalContext';
import { getAuth, getRedirectResult } from 'firebase/auth';
import { LastLocationProvider } from 'react-router-last-location';
import AppContainer from 'components/AppContainer/AppContainer';
import AppFrame from 'components/AppFrame/AppFrame';
import SideMenu from 'components/SideMenu/SideMenu';
import GlobalStyle from 'styles/global';
import Toast from 'components/Toast';
import Text from 'components/Text';
import Routes from './routes';
import SuccessDrawerWrapper from 'components/SuccessDrawer/SuccessDrawerWrapper';
import { useSuccessDrawerContext } from 'context/SuccessDrawerContext/SuccessDrawerContext';
import { showToast } from 'components/Toast/Toast';
import { useAPI } from 'utils/api';
import { useAPICacheContext } from 'context/APICacheContext/APICacheContext';

export default function App() {
  const userFormUpdateId = localStorage.getItem('brij-form-user-update-id');
  const {
    appZoom,
    setProductModule,
    setAlreadySignIn,
    user: existingUser,
    setRegisteringProduct,
    setRedirectResolved,
    token,
    isPreviewMode,
    setToken,
  } = useGlobal();

  const { invalidateCache } = useAPICacheContext();

  // TODO: invalid cache
  useEffect(() => {
    const productId = localStorage.getItem('currentProductModuleId');

    if (!productId) {
      invalidateCache();
    }
  }, []);

  useLayoutEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  const { openDrawer } = useSuccessDrawerContext();

  useEffect(() => {
    if (token && isPreviewMode) {
      setToken(null);
    }
  }, [token, isPreviewMode]);

  const [updateForm] = useAPI<{ user: string }>({
    method: 'PUT',
    endpoint: `form/form_answers/${userFormUpdateId}`,
    onSuccess: () => {
      localStorage.removeItem('brij-form-user-update-id');
    },
    onError: () => {},
  });

  useEffect(() => {
    const auth = getAuth();

    getRedirectResult(auth)
      .then((result) => {
        if (!!result) {
          let w: any = window;
          w.dataLayer.push({ event: 'userRegistrationEvent' });
        }
        let user = result?.user;

        if (user && !existingUser) {
          if (userFormUpdateId) {
            updateForm({ user: user.uid });
          }
          let moduleId = localStorage.getItem('currentProductModuleId');
          if (moduleId) {
            setProductModule(moduleId);
            setAlreadySignIn(false);
            setRegisteringProduct(true);

            localStorage.removeItem('currentProductModuleId');
          }
        }

        setRedirectResolved(true);
      })
      .catch((error) => showToast({ message: error, type: 'error' }));
  }, [
    setProductModule,
    setAlreadySignIn,
    existingUser,
    setRegisteringProduct,
    openDrawer,
    setRedirectResolved,
    token,
    userFormUpdateId,
    updateForm,
  ]);

  if (isBrowser) {
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }

  const browserRouter = (
    <div id={isBrowser ? '' : 'portrait'}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <LastLocationProvider>
          <SuccessDrawerWrapper />
          <SideMenu />
          <Routes />
        </LastLocationProvider>
      </BrowserRouter>
    </div>
  );

  return (
    <AppContainer isBrowser={isBrowser} style={{ zoom: appZoom }}>
      <GlobalStyle />
      {isBrowser ? <AppFrame>{browserRouter}</AppFrame> : browserRouter}
      <Text
        id={isBrowser ? 'hide' : 'landscape'}
        fontSize='18px'
        textAlign='center'
        wrapperWidth='max-content'
      >
        <span>Please rotate device to view experience</span>
      </Text>
      <Toast />
    </AppContainer>
  );
}
