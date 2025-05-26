/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import api from "./api"; // Import api to potentially use for token validation

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
  const [accessToken, setAccessToken] = useState(null); // Initialize as null
  const [refreshToken, setRefreshToken] = useState(null); // Initialize as null
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    console.log("Executing logout in AuthContext");
    localStorage.clear();
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    // setIsLoading(false);
    // Optionally:
    // window.location.href = "/login"; // For a hard redirect if needed from other parts of app
  }, []);

  // useEffect(() => {
  //   const storedAccessToken = localStorage.getItem(ACCESS_TOKEN);
  //   const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);
  //   if (storedAccessToken && storedRefreshToken) {
  //     setAccessToken(storedAccessToken);
  //     setRefreshToken(storedRefreshToken);
  //     setIsAuthenticated(true);
  //   }
  // }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("check auth status");
      const storedAccessToken = localStorage.getItem(ACCESS_TOKEN);
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (storedAccessToken) {
        try {
          const decoded = jwtDecode(storedAccessToken);
          const tokenExpiration = decoded.exp;
          const now = Date.now() / 1000;

          if (tokenExpiration < now) {
            // Access token expired
            if (storedRefreshToken) {
              try {
                console.log("Attempting to refresh token on initial load...");
                const refreshResponse = await api.post("/api/token/refresh/", {
                  // Use your actual api instance
                  refresh: storedRefreshToken,
                });
                localStorage.setItem(ACCESS_TOKEN, refreshResponse.data.access);
                setAccessToken(refreshResponse.data.access);
                setRefreshToken(storedRefreshToken); // Assuming refresh token is still valid
                setIsAuthenticated(true);
                console.log("Token refreshed successfully on load.");
              } catch (refreshError) {
                console.error("Initial load refresh failed:", refreshError);
                logout(); // Refresh failed, logout
              }
            } else {
              logout(); // No refresh token, logout
            }
          } else {
            // Access token is valid
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setIsAuthenticated(true);
          }
        } catch (decodeError) {
          console.error("Error decoding token on initial load:", decodeError);
          logout(); // Token is invalid
        }
      }
      // setIsLoading(false);
    };

    checkAuthStatus();

    const handleAuthFailureGlobal = () => {
      console.log(
        "Global authFailure event caught in AuthContext, logging out."
      );
      logout();
    };

    window.addEventListener("authFailureGlobal", handleAuthFailureGlobal);
    return () => {
      window.removeEventListener("authFailureGlobal", handleAuthFailureGlobal);
    };
  }, [logout]); // Include logout in dependency array

  const login = (newAccessToken, newRefreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
    localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);
  };

  // const logout = () => {
  //   localStorage.clear();
  //   setIsAuthenticated(false);
  // };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
