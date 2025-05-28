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

    // const checkAuthStatus = async () => {
    //   console.log("check auth status");
    //   setIsLoading(true);
    //   const storedAccessToken = localStorage.getItem(ACCESS_TOKEN);
    //   const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);

    //   if (storedAccessToken) {
    //     try {
    //       const decoded = jwtDecode(storedAccessToken);
    //       const tokenExpiration = decoded.exp;
    //       const now = Date.now() / 1000;

    //       if (tokenExpiration < now) { // Access token expired
    //         if (storedRefreshToken) {
    //           try {
    //             console.log("Attempting to refresh token on initial load...");
    //             const refreshResponse = await api.post("/api/token/refresh/", {
    //               refresh: storedRefreshToken,
    //             });
    //             localStorage.setItem(ACCESS_TOKEN, refreshResponse.data.access);
    //             setAccessToken(refreshResponse.data.access);
    //             setRefreshToken(storedRefreshToken); // Assuming refresh token is still valid
    //             setIsAuthenticated(true);
    //             console.log("Token refreshed successfully on load.");
    //           } catch (refreshError) {
    //             console.error("Initial load refresh failed:", refreshError);
    //             logout(); // Refresh failed, logout
    //           }
    //         } else {
    //           logout(); // No refresh token, logout
    //         }
    //       } else { // Access token is valid
    //         setAccessToken(storedAccessToken);
    //         setRefreshToken(storedRefreshToken);
    //         setIsAuthenticated(true);
    //       }
    //     } catch (decodeError) {
    //       console.error("Error decoding token on initial load:", decodeError);
    //       logout(); // Token is invalid
    //     }
    //   } else { // No access token in storage
    //     console.log("AuthContext: No access token found in storage, logging out.");
    //     logout(); // Ensures isAuthenticated is false and other states are clean
    //   }
    //   setIsLoading(false);
    // };

    // checkAuthStatus();

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

  //   const handleAuthFailureGlobal = () => {
  //     console.log(
  //       "AuthContext: Global authFailure event caught in AuthContext, logging out."
  //     );
  //     logout();
  //   };

  //   window.addEventListener("authFailureGlobal", handleAuthFailureGlobal);
  //   return () => {
  //     window.removeEventListener("authFailureGlobal", handleAuthFailureGlobal);
  //   };
  // }, [logout]); // Include logout in dependency array

  const login = (newAccessToken, newRefreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, newAccessToken);
    localStorage.setItem(REFRESH_TOKEN, newRefreshToken);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  // const logout = () => {
  //   localStorage.clear();
  //   setIsAuthenticated(false);
  // };

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
