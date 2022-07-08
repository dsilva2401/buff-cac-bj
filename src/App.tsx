import { useLayoutEffect, useEffect } from 'react';
import { isBrowser } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import { useGlobal } from './context/global/GlobalContext';
import { getAuth, getRedirectResult } from 'firebase/auth';
import { MAGIC_ACTION } from 'context/global/GlobalProvider';
import { LastLocationProvider } from 'react-router-last-location';
import AppContainer from 'components/AppContainer/AppContainer';
import AppFrame from 'components/AppFrame/AppFrame';
import SideMenu from 'components/SideMenu/SideMenu';
import GlobalStyle from 'styles/global';
import Toast from 'components/Toast';
import Text from 'components/Text';
import Routes from './routes';

export default function App() {
  const {
    appZoom,
    setUser,
    setProductModule,
    setMagicPayload,
    setMagicAction,
    setAlreadySignIn,
    user: existingUser,
    setRegisteringProduct,
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
          setRegisteringProduct(true);
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
    setRegisteringProduct,
  ]);

  if (isBrowser) {
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }

  const browserRouter = (
    <div id='portrait'>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <LastLocationProvider>
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
        id='landscape'
        fontSize='18px'
        textAlign='center'
        wrapperWidth='max-content'
      >
        <span>Please rotate device for Brij experience</span>
      </Text>
      <Toast />
    </AppContainer>
  );
}
