// frontend/src/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
// import { jwtDecode } from "jwt-decode"; // Import jwtDecode
// import api from "./api"; // Import api to potentially use for token validation
import PropTypes from "prop-types";

// default to ensure context is never undefined
const defaultAuthContextState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => console.warn("Login function not yet available"),
  logout: () => console.warn("Logout function not yet available"),
};
export const AuthContext = createContext(defaultAuthContextState);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    console.log("Executing logout in AuthContext");
    localStorage.clear();
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // simplified, don't need redundant auth check
    const initializeAuth = () => {
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (storedAccessToken && storedRefreshToken) {
        // Assume tokens are valid initially
        // Let API calls handle expiration via interceptor
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);
      } else {
        // No tokens found
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    initializeAuth();

    // Listen for auth failures from API interceptor
    const handleAuthFailure = () => {
      console.log("AuthContext: Auth failure event received, logging out.");
      logout();
    };

    window.addEventListener("authFailureGlobal", handleAuthFailure);

    return () => {
      window.removeEventListener("authFailureGlobal", handleAuthFailure);
    };
  }, [logout]);

  const login = (newAccessToken, newRefreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
    localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
