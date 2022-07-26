import React from 'react';
import App from './App';
import ReactDOM from 'react-dom';
import { initializeApp } from '@firebase/app';
import {
  GlobalProvider,
  APICacheProvider,
  SuccessDrawerProvider,
} from './context';
import getFirebaseConfig from './firebase/config';
import './i18n';

const firebaseConfig = getFirebaseConfig();

initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <APICacheProvider>
      <GlobalProvider>
        <SuccessDrawerProvider>
          <App />
        </SuccessDrawerProvider>
      </GlobalProvider>
    </APICacheProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
