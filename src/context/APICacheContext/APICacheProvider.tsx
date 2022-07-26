import React from 'react';
import LocalStorageService from 'utils/localStorageService';
import { APICacheContext } from './APICacheContext';

export const APICacheProvider: React.FC = ({ children }) => {
  const storage = new LocalStorageService('api-cache');

  const getCacheForAPI = (endPoint: string) => {
    const state = storage.getLocal();

    if (!state) {
      return null;
    }

    return state[endPoint];
  };

  const updateCacheForAPI = (endPoint: string, payload: any) => {
    const state = storage.getLocal();
    storage.setLocal({
      ...state,
      [endPoint]: payload,
    });
  };

  return (
    <APICacheContext.Provider
      value={{
        updateCacheForAPI,
        getCacheForAPI,
        invalidateCache: storage.removeLocal,
      }}
    >
      {children}
    </APICacheContext.Provider>
  );
};
