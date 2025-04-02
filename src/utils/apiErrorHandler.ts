import axios, { AxiosError } from 'axios';

/**
 * Extract a readable error message from various error types
 * @param error Any error object
 * @returns A human-readable error message
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle axios errors
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    // Handle server error response
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      
      // Try to extract error message from response data
      if (typeof data === 'object' && data !== null) {
        const message = 
          (data as any).message || 
          (data as any).error || 
          (data as any).detail ||  
          JSON.stringify(data);
        return `Error ${status}: ${message}`;
      }
      
      // Use status text if no detailed message
      return `Error ${status}: ${axiosError.message}`;
    }
    
    // Network error (no response received)
    if (axiosError.request) {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Configuration error (error before sending request)
    return `Request error: ${axiosError.message}`;
  }
  
  // For standard Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // For string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // For unknown error types, convert to string if possible
  try {
    return String(error);
  } catch {
    return 'An unknown error occurred';
  }
};
