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

// request interceptor
api.interceptors.request.use(
  (config) => {
    // use access token as auth header if we have one
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

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// function to refersh the access token
const refreshToken = async () => {
  try {
    
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    // console.log("🚀 ~ refreshToken ~ refreshToken:", refreshToken)
    const response = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });
    localStorage.setItem(ACCESS_TOKEN, response.data.access);
    return response.data.access;
  } catch (error) {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    throw error;
  }
};

// response interceptor to handle 401 errors and refresh the token
const handleResponseError = async (error) => {
  // console.log("🚀 ~ handleResponseError ~")
  const originalRequest = error.config;
  if (
    error.response &&
    error.response.status === 401 &&
    !originalRequest._retry
  ) {
    if (isRefreshing) {
      // If already refreshing, queue the request
      // console.log("🚀 ~ handleResponseError ~ isRefreshing:", isRefreshing)
      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // console.log("🚀 ~ try refreshToken() ~")
      const newAccessToken = await refreshToken();
      // console.log("🚀 ~ handleResponseError ~ newAccessToken:", newAccessToken)
      isRefreshing = false;
      onRefreshed(newAccessToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
};

api.interceptors.response.use(
  (response) => response,
  (error) => handleResponseError(error)
);

export default api;
