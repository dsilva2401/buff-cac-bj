import { createContext, useContext } from 'react';

export type APICacheContextProps = {
  updateCacheForAPI: (endPoint: string, payload: any) => void;
  getCacheForAPI: (endPoint: string) => any;
  invalidateCache: () => void;
};

export const APICacheContext = createContext<APICacheContextProps>({
  updateCacheForAPI: () => {},
  getCacheForAPI: () => {},
  invalidateCache: () => {},
});

export const useAPICacheContext = () => useContext(APICacheContext);
