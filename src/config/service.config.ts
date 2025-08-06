import { AuthService } from "@/services/auth.service";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8100/supermercado-service";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
// Variable to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};
const isTokenExpired = () => {
    const expiration = Cookies.get("expiration");
    if (!expiration) return true;
    const expirationDate = new Date(expiration);
    return expirationDate < new Date();
  };
// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    let token = Cookies.get("token");

    if (token && isTokenExpired()) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          token = ( await apiClient.post(
                  "/auth/refresh-token")).data.token;
          processQueue(null, token);
        } catch (error) {
          processQueue(error, null);
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          config.headers["Authorization"] = `Bearer ${newToken}`;
          return config;
        });
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as any; // Type assertion to avoid TS errors

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await apiClient.post(
                  "/auth/refresh-token")
          processQueue(null, newToken.data.token);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          Cookies.remove("token");
          Cookies.remove("refresh-token");
          Cookies.remove("token-expiration");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }
    }

    return Promise.reject(error);
  }
);
