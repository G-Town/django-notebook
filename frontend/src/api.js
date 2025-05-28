// frontend/src/api.js
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/django-notebook/backend/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

// Set up interceptors to modify outgoing requests before they are sent.
// This automatically adds the access and refresh tokens with every
// request to authenticate use with backend API, so we don't have to
// manually add it in the hearder of every request.

// request interceptor - add auth header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Token refresh management
let isRefreshing = false;
let refreshSubscribers = []; // Array of { resolve, reject, originalRequestConfig }

// const onRefreshed = (token) => {
//   refreshSubscribers.forEach((callback) => callback(token));
//   refreshSubscribers = [];
// };

const onRefreshed = (token) => {
  refreshSubscribers.forEach((subscriber) => {
    if (subscriber.originalRequestConfig.headers) {
      // Ensure headers exist
      subscriber.originalRequestConfig.headers[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    subscriber.resolve(api(subscriber.originalRequestConfig));
  });
  refreshSubscribers = [];
};

const onRefreshFailed = (error) => {
  refreshSubscribers.forEach((subscriber) => {
    subscriber.reject(error);
  });
  refreshSubscribers = [];
};

// const addRefreshSubscriber = (callback) => {
//   refreshSubscribers.push(callback);
// };

const addRefreshSubscriber = (resolve, reject, originalRequestConfig) => {
  refreshSubscribers.push({ resolve, reject, originalRequestConfig });
};

// function to refresh the access token
// const refreshToken = async () => {
//   try {
//     const refreshToken = localStorage.getItem(REFRESH_TOKEN);
//     if (!refreshToken) {
//       // Added check for refresh token
//       throw new Error("No refresh token available");
//     }
//     // console.log("🚀 ~ refreshToken ~ refreshToken:", refreshToken);
//     const response = await api.post("/api/token/refresh/", {
//       refresh: refreshToken,
//     });
//     console.log("🚀 ~ refreshToken ~ response:", response);
//     localStorage.setItem(ACCESS_TOKEN, response.data.access);
//     return response.data.access;
//   } catch (error) {
//     console.error("Token refresh failed:", error);
//     localStorage.removeItem(ACCESS_TOKEN);
//     localStorage.removeItem(REFRESH_TOKEN);
//     console.log("🚀 ~ refreshToken ~ authFailureGlobal");
//     window.dispatchEvent(new CustomEvent("authFailureGlobal"));
//     throw error;
//   }
// };

const refreshAuth = async () => {
  try {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!storedRefreshToken) {
      throw new Error("No refresh token available");
    }
    // Use Option B: Separate Axios instance for clarity
    // const response = await plainApi.post("/api/token/refresh/", {
    //   refresh: storedRefreshToken,
    // });
    const response = await api.post(
      "/api/token/refresh/",
      { refresh: storedRefreshToken },
      { _isRefreshCall: true } // Prevent interceptor from handling this call
    ); // Option A

    const newAccessToken = response.data.access;
    localStorage.setItem(ACCESS_TOKEN, newAccessToken);

    api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

    onRefreshed(newAccessToken); // Notify subscribers of success
    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);

    window.dispatchEvent(new CustomEvent("authFailureGlobal")); // Notify AuthContext to logout
    onRefreshFailed(error); // Notify subscribers of failure
    throw error;
  }
};

// response interceptor to handle 401 errors and refresh the token
// const handleResponseError = async (error) => {
//   console.log("🚀 ~ handleResponseError ~");
//   const originalRequest = error.config;
//   if (
//     error.response &&
//     error.response.status === 401 &&
//     !originalRequest._retry
//   ) {
//     if (isRefreshing) {
//       // If already refreshing, queue the request
//       console.log("🚀 ~ handleResponseError ~ isRefreshing:", isRefreshing)
//       return new Promise((resolve) => {
//         addRefreshSubscriber((token) => {
//           originalRequest.headers["Authorization"] = `Bearer ${token}`;
//           resolve(api(originalRequest));
//         });
//       });
//     }

//     originalRequest._retry = true;
//     isRefreshing = true;

//     try {
//       console.log("🚀 ~ try refreshAuth() ~");
//       const newAccessToken = await refreshAuth();
//       // console.log("🚀 ~ handleResponseError ~ newAccessToken:", newAccessToken)
//       isRefreshing = false;
//       onRefreshed(newAccessToken);

//       api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
//       originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//       return api(originalRequest);
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   }
//   return Promise.reject(error);
// };

// api.interceptors.response.use(
//   (response) => response,
//   (error) => handleResponseError(error)
// );

// Response interceptor - handle 401s and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check if it's a 401, not a retry, and not the refresh call itself
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest._isRefreshCall
    ) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber(resolve, reject, originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAuth();
        isRefreshing = false; // Reset after potential success of refreshAuth
        // onRefreshed will have been called by refreshAuth
        return api(originalRequest); // Retry the original request with new token
      } catch (refreshError) {
        isRefreshing = false; // Reset on error too
        // onRefreshFailed will have been called by refreshAuth
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
