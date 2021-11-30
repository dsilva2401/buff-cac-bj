import Routes from "./routes";
import config from "./firebase/config";
import GlobalStyle from "styles/global";
import { initializeApp } from "@firebase/app";
import { useLayoutEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Container from "components/Container/Container";
import AppFrame from "components/AppFrame/AppFrame";
import SideMenu from "components/SideMenu/SideMenu";

export default function App() {
  initializeApp(config.firebase);

  useLayoutEffect(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, [])

  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
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
