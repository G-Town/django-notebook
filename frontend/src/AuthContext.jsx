/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem(ACCESS_TOKEN));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem(ACCESS_TOKEN);
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (newAccessToken, newRefreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
    localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
