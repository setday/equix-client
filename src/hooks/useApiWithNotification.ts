import { useState, useCallback } from 'react';
import { AxiosResponse } from 'axios';
import { useNotification } from '../contexts/NotificationContext';
import { getErrorMessage } from '../utils/apiErrorHandler';

interface UseApiOptions {
  showSuccessNotification?: boolean;
  successMessage?: string;
  showErrorNotification?: boolean;
  errorMessage?: string;
}

export function useApiWithNotification(defaultOptions: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useNotification();

  const callApi = useCallback(
    async <R>(
      apiPromise: Promise<AxiosResponse<R>>,
      options: UseApiOptions = {}
    ): Promise<R | null> => {
      const {
        showSuccessNotification = defaultOptions.showSuccessNotification ?? false,
        successMessage = defaultOptions.successMessage ?? 'Operation completed successfully',
        showErrorNotification = defaultOptions.showErrorNotification ?? true,
        errorMessage = defaultOptions.errorMessage
      } = options;

      setLoading(true);
      setError(null);

      try {
        const response = await apiPromise;
        
        if (showSuccessNotification) {
          showSuccess(successMessage);
        }
        
        setLoading(false);
        return response.data;
      } catch (err) {
        setError(err as Error);
        
        if (showErrorNotification) {
          const finalErrorMessage = errorMessage || getErrorMessage(err);
          showError(finalErrorMessage);
        }
        
        setLoading(false);
        return null;
      }
    },
    [showSuccess, showError, defaultOptions]
  );

  return {
    loading,
    error,
    callApi
  };
}
