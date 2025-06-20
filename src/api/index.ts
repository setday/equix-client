import axios, { AxiosInstance } from "axios";
import { getErrorMessage } from "./services/apiErrorHandler";
import { API_CONFIG } from "../config/constants";

/**
 * Configured axios instance for API requests
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: API_CONFIG.TIMEOUT,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", getErrorMessage(error));
    return Promise.reject(error);
  },
);

export * from "./services/documentService";
