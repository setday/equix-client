import axios, { AxiosError } from "axios";

/**
 * Extract a readable error message from various error types
 * @param error Any error object
 * @returns A human-readable error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const { status, data } = axiosError.response;

      if (typeof data === "object" && data !== null) {
        const message =
          (data as any).message ||
          (data as any).error ||
          (data as any).detail ||
          JSON.stringify(data);
        return `Error ${status}: ${message}`;
      }

      return `Error ${status}: ${axiosError.message}`;
    }

    if (axiosError.request) {
      return "Network error. Please check your connection and try again.";
    }

    return `Request error: ${axiosError.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return String(error);
  } catch {
    return "An unknown error occurred";
  }
};
