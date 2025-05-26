// // authService.js
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
// import api from "../api";
// import { jwtDecode } from "jwt-decode";

// export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN);
// export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

// export const setTokens = (access, refresh) => {
//   localStorage.setItem(ACCESS_TOKEN, access);
//   localStorage.setItem(REFRESH_TOKEN, refresh);
// };

// export const clearTokens = () => {
//   localStorage.removeItem(ACCESS_TOKEN);
//   localStorage.removeItem(REFRESH_TOKEN);
// };

// export const isTokenExpired = (token) => {
//   if (!token) return true;
//   const { exp } = jwtDecode(token);
//   return Date.now() / 1000 >= exp;
// };

// export const refreshAccessToken = async () => {
//   const refresh = getRefreshToken();
//   const response = await api.post("/api/token/refresh/", { refresh });
//   const { access } = response.data;
//   setTokens(access, refresh);
//   return access;
// };
