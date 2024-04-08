import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/django-notebook/backend/rest-api-be2/v1.0"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl
})

// Set up interceptor to modify outgoing requests before they are sent.
// This allows us to use the access token with every request to
// authenticate use with backend API.
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

export default api;
