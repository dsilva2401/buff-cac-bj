const config = {
  dev: {
    apiKey: 'AIzaSyDYbG1Th_mH18QyJgTSPb9X9_s3nBMyQWM',
    authDomain: 'brij-consumer-app.firebaseapp.com',
    projectId: 'brij-consumer-app',
    storageBucket: 'brij-consumer-app.appspot.com',
    messagingSenderId: '192547937849',
    appId: '1:192547937849:web:6574438629fe6b2d6077e8',
    measurementId: 'G-Q1TYGKZFCC',
  },
  prod: {
    apiKey: 'AIzaSyAT0Dm-CmWywl5ooF0lYjwQj1-BxqptgxI',
    authDomain: 'brij-app-689a0.firebaseapp.com',
    projectId: 'brij-app-689a0',
    storageBucket: 'brij-app-689a0.appspot.com',
    messagingSenderId: '169134345429',
    appId: '1:169134345429:web:d6e2b729a082518381665c',
    measurementId: 'G-59ZE8ST52G',
  },
};

const getFirebaseConfig = () => {
  switch (process.env.REACT_APP_NODE_ENV) {
    case 'development':
      return config.dev;
    case 'production':
      return config.prod;
    default:
      return config.dev;
  }
};

export default getFirebaseConfig;
