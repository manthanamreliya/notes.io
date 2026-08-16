import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const isProd = Boolean(import.meta.env.PROD);

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let onUnauthenticatedCallback: (() => void) | null = null;

export const setOnUnauthenticated = (callback: () => void) => {
  onUnauthenticatedCallback = callback;
};

// Render Free Tier Cold-Start Listener State
let activeRequestsCount = 0;
let coldStartTimer: ReturnType<typeof setTimeout> | null = null;
const coldStartListeners: Set<(isWaking: boolean) => void> = new Set();

export const subscribeColdStart = (listener: (isWaking: boolean) => void) => {
  coldStartListeners.add(listener);
  return () => {
    coldStartListeners.delete(listener);
  };
};

const notifyColdStart = (isWaking: boolean) => {
  coldStartListeners.forEach((fn) => fn(isWaking));
};

const onRequestStart = () => {
  if (!isProd) return;
  activeRequestsCount++;
  if (activeRequestsCount === 1 && !coldStartTimer) {
    coldStartTimer = setTimeout(() => {
      notifyColdStart(true);
    }, 3000);
  }
};

const onRequestFinish = () => {
  if (!isProd) return;
  activeRequestsCount = Math.max(0, activeRequestsCount - 1);
  if (activeRequestsCount === 0) {
    if (coldStartTimer) {
      clearTimeout(coldStartTimer);
      coldStartTimer = null;
    }
    notifyColdStart(false);
  }
};

apiClient.interceptors.request.use(
  (config) => {
    if (isProd && !(config as any)._tracked) {
      (config as any)._tracked = true;
      onRequestStart();
    }
    return config;
  },
  (error) => {
    if (isProd && error.config && (error.config as any)._tracked) {
      delete (error.config as any)._tracked;
      onRequestFinish();
    }
    return Promise.reject(error);
  }
);

// Response Interceptor for automatic 401 token refresh & cold start tracking
apiClient.interceptors.response.use(
  (response) => {
    if (isProd && response.config && (response.config as any)._tracked) {
      delete (response.config as any)._tracked;
      onRequestFinish();
    }
    return response;
  },
  async (error: AxiosError) => {
    if (isProd && error.config && (error.config as any)._tracked) {
      delete (error.config as any)._tracked;
      onRequestFinish();
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/signup') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        await apiClient.post('/auth/refresh');
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (onUnauthenticatedCallback) {
          onUnauthenticatedCallback();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
