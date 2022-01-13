import { useLayoutEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppFrame from 'components/AppFrame/AppFrame';
import Container from 'components/Container/Container';
import SideMenu from 'components/SideMenu/SideMenu';
import GlobalStyle from 'styles/global';
import Toast from 'components/Toast';
import Routes from './routes';

export default function App() {
  useLayoutEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  return (
    <Container>
      <GlobalStyle />
      <AppFrame>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <SideMenu />
          <Routes />
        </BrowserRouter>
      </AppFrame>
      <Toast />
    </Container>
  );
};
