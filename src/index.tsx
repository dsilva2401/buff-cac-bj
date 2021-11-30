import "./i18n";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import { GlobalProvider } from "./context";

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
