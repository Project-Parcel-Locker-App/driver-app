// AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface AuthContextProps {
  children: ReactNode;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    // 本来はサーバーとの認証などが行われる
    setIsLoggedIn(true);
  };

  const logout = () => {
    // ログアウト処理
    setIsLoggedIn(false);
  };

  const contextValue: AuthContextValue = {
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
