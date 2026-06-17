import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Shared axios instance for customer-facing API calls.
 * Sends cookies (for the refresh token) and attaches the access token
 * from memory/localStorage to the Authorization header.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Separate instance for the admin portal, since admin and customer
 * sessions use different tokens/cookies but share the same API base.
 */
export const adminApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const ACCESS_TOKEN_KEY = 'sfb_access_token';
const ADMIN_ACCESS_TOKEN_KEY = 'sfb_admin_access_token';

export const tokenStorage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  clearAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),

  getAdminAccessToken: () => localStorage.getItem(ADMIN_ACCESS_TOKEN_KEY),
  setAdminAccessToken: (token) => localStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, token),
  clearAdminAccessToken: () => localStorage.removeItem(ADMIN_ACCESS_TOKEN_KEY),
};

// --- Request interceptors: attach access token ---
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.request.use((config) => {
  const token = tokenStorage.getAdminAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Builds a response interceptor that attempts a single silent token
 * refresh on a 401, then retries the original request.
 */
const buildRefreshInterceptor = (instance, refreshPath, getToken, setToken, clearToken, onAuthFailure) => {
  let refreshPromise = null;

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response, config } = error;

      if (!response || response.status !== 401 || config._retried) {
        return Promise.reject(error);
      }

      // Don't try to refresh on the refresh/login endpoints themselves
      if (config.url.includes('/refresh') || config.url.includes('/login')) {
        clearToken();
        if (onAuthFailure) onAuthFailure();
        return Promise.reject(error);
      }

      config._retried = true;

      try {
        if (!refreshPromise) {
          refreshPromise = instance.post(refreshPath).finally(() => {
            refreshPromise = null;
          });
        }
        const { data } = await refreshPromise;
        const newToken = data?.data?.accessToken;
        if (newToken) {
          setToken(newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
          return instance(config);
        }
        throw new Error('No access token returned from refresh');
      } catch (refreshError) {
        clearToken();
        if (onAuthFailure) onAuthFailure();
        return Promise.reject(refreshError);
      }
    }
  );
};

buildRefreshInterceptor(
  api,
  '/auth/refresh',
  tokenStorage.getAccessToken,
  tokenStorage.setAccessToken,
  tokenStorage.clearAccessToken,
  () => {
    window.dispatchEvent(new CustomEvent('sfb:auth-expired'));
  }
);

buildRefreshInterceptor(
  adminApi,
  '/admin/auth/refresh',
  tokenStorage.getAdminAccessToken,
  tokenStorage.setAdminAccessToken,
  tokenStorage.clearAdminAccessToken,
  () => {
    window.dispatchEvent(new CustomEvent('sfb:admin-auth-expired'));
  }
);

/**
 * Extracts a user-friendly error message from an API error response.
 */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  return error?.response?.data?.error?.message || error?.message || fallback;
};

/**
 * Extracts field-level validation error details, if present.
 */
export const getFieldErrors = (error) => {
  const details = error?.response?.data?.error?.details;
  if (!Array.isArray(details)) return {};
  return details.reduce((acc, d) => {
    if (d.field) acc[d.field] = d.message;
    return acc;
  }, {});
};
