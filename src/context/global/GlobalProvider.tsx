import React, { useState } from 'react';
import {
  darkTheme,
  GlobalContext,
  lightTheme,
  ThemeMode,
} from './GlobalContext';
export const GlobalProvider: React.FC = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  return (
    <GlobalContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        theme,
        lightTheme,
        darkTheme,
        setTheme,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
