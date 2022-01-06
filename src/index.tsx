import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';
import { initializeApp } from '@firebase/app';
import { GlobalProvider } from './context';
import config from './firebase/config';
import './i18n';

initializeApp(config.firebase);

ReactDOM.render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
