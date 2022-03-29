const config = {
  staging: {
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
  rc: {
    apiKey: 'AIzaSyDPUHsSedmwFjuDnGgKcrBC2IzHQsD1rrE',
    authDomain: 'brij-rc.firebaseapp.com',
    projectId: 'brij-rc',
    storageBucket: 'brij-rc.appspot.com',
    messagingSenderId: '58128415401',
    appId: '1:58128415401:web:6112a96ecb05f62cacc7b8',
  },
};

const getFirebaseConfig = () => {
  switch (process.env.REACT_APP_NODE_ENV) {
    case 'staging':
      return config.staging;
    case 'production':
      return config.prod;
    case 'rc':
      return config.rc;
    default:
      return config.staging;
  }
};

export default getFirebaseConfig;
