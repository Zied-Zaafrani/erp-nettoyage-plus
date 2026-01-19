import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types';

// ============================================
// API CLIENT CONFIGURATION
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token to requests
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Extract error message
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Create a standardized error
    const apiError: ApiError = {
      statusCode: error.response?.status || 500,
      message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
      error: error.response?.data?.error,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Build query string from params object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Set auth token in storage and axios headers
 */
export function setAuthToken(token: string): void {
  localStorage.setItem('accessToken', token);
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

/**
 * Clear auth token from storage and axios headers
 */
export function clearAuthToken(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  delete apiClient.defaults.headers.common.Authorization;
}

/**
 * Get stored token
 */
export function getStoredToken(): string | null {
  return localStorage.getItem('accessToken');
}

/**
 * Get stored user
 */
export function getStoredUser<T>(): T | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Set stored user
 */
export function setStoredUser<T>(user: T): void {
  localStorage.setItem('user', JSON.stringify(user));
}
