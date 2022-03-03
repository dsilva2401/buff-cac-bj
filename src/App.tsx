import { useLayoutEffect } from 'react';
import { isBrowser } from 'react-device-detect';
import { BrowserRouter } from 'react-router-dom';
import { useGlobal } from './context/global/GlobalContext';
import { LastLocationProvider } from 'react-router-last-location';
import Container from 'components/Container/Container';
import AppFrame from 'components/AppFrame/AppFrame';
import SideMenu from 'components/SideMenu/SideMenu';
import GlobalStyle from 'styles/global';
import Toast from 'components/Toast';
import Routes from './routes';

export default function App() {
  useLayoutEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);
  const { appZoom } = useGlobal();

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
    <Container isBrowser={isBrowser} style={{ zoom: appZoom }}>
      <GlobalStyle />
      {isBrowser ? <AppFrame>{browserRouter}</AppFrame> : browserRouter}
      <Toast />
    </Container>
  );
}
