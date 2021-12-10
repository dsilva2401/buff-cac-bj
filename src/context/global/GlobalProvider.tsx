import React, { useState } from "react";
import {
  darkTheme,
  GlobalContext,
  lightTheme,
  PageStateType,
  ThemeMode,
} from "./GlobalContext";
export const GlobalProvider: React.FC = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [signInRedirect, setSignInRedirect] = useState<string>("");
  const [pageState, setPageState] = useState<PageStateType | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        isMenuOpen,
        setIsMenuOpen,
        theme,
        lightTheme,
        darkTheme,
        setTheme,
        signInRedirect,
        setSignInRedirect,
        pageState,
        setPageState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
