import { useLayoutEffect, useEffect } from 'react';
import { isBrowser } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import { useGlobal } from './context/global/GlobalContext';
import { LastLocationProvider } from 'react-router-last-location';
import AppContainer from 'components/AppContainer/AppContainer';
import AppFrame from 'components/AppFrame/AppFrame';
import SideMenu from 'components/SideMenu/SideMenu';
import GlobalStyle from 'styles/global';
import Toast from 'components/Toast';
import Routes from './routes';
import { getAuth, getRedirectResult } from 'firebase/auth';
import { MAGIC_ACTION } from 'context/global/GlobalProvider';

export default function App() {
  const {
    appZoom,
    setUser,
    setProductModule,
    setMagicPayload,
    setMagicAction,
    setAlreadySignIn,
    user: existingUser,
  } = useGlobal();

  useLayoutEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  useEffect(() => {
    const auth = getAuth();

    getRedirectResult(auth).then((result) => {
      let user = result?.user;
      if (user && !existingUser) {
        setUser(user);
        let moduleId = localStorage.getItem('currentProductModuleId');
        if (moduleId) {
          setProductModule(moduleId);
          localStorage.removeItem('currentProductModuleId');
          setMagicAction(MAGIC_ACTION.OPEN_MODULE);
          setMagicPayload({ moduleId: moduleId });
          setAlreadySignIn(false);
        }
      }
    });
  }, [
    setProductModule,
    setMagicAction,
    setMagicPayload,
    setAlreadySignIn,
    setUser,
    existingUser,
  ]);

  if (isBrowser) {
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }

  const browserRouter = (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <LastLocationProvider>
        <SideMenu />
        <Routes />
      </LastLocationProvider>
    </BrowserRouter>
  );

  return (
    <AppContainer isBrowser={isBrowser} style={{ zoom: appZoom }}>
      <GlobalStyle />
      {isBrowser ? <AppFrame>{browserRouter}</AppFrame> : browserRouter}
      <Toast />
    </AppContainer>
  );
}
