interface LocalStorageServiceClass {
  key: string;
  setLocal: (payload: any) => void;
  getLocal: () => void;
  removeLocal: () => void;
}

class LocalStorageService implements LocalStorageServiceClass {
  key: string = '';

  constructor(key: string) {
    this.key = key;
  }

  setLocal(payload: any) {
    localStorage.setItem(this.key, JSON.stringify(payload));
  }

  getLocal = () => {
    const stringifiedCache = localStorage.getItem(this.key);

    const localCache = stringifiedCache ? JSON.parse(stringifiedCache) : null;

    return localCache;
  };

  removeLocal = () => {
    localStorage.removeItem(this.key);
  };
}

export default LocalStorageService;
