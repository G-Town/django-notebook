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

const addRefreshSubscriber = (resolve, reject, originalRequestConfig) => {
  refreshSubscribers.push({ resolve, reject, originalRequestConfig });
};

const refreshAuth = async () => {
  try {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!storedRefreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await api.post(
      "/api/token/refresh/",
      { refresh: storedRefreshToken },
      { _isRefreshCall: true } // Prevent interceptor from handling this call
    );

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
