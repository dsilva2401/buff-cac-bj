import AppFrame from 'components/AppFrame/AppFrame';
import Container from 'components/Container/Container';
import SideMenu from 'components/SideMenu/SideMenu';
import { useLayoutEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalStyle from 'styles/global';
import Routes from './routes';

export default function App() {
  useLayoutEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  return (
    <Container>
      <GlobalStyle />
      <AppFrame>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <SideMenu />
          <Routes />
        </BrowserRouter>
      </AppFrame>
    </Container>
  );
}
