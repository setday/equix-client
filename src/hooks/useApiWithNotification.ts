import { useState, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { getErrorMessage } from '../utils/apiErrorHandler';

interface UseApiOptions {
  showSuccessNotification?: boolean;
  successMessage?: string;
  showErrorNotification?: boolean;
  errorMessage?: string | ((error: any) => string);
}

export function useApiWithNotification(defaultOptions: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useNotification();

  const callApi = useCallback(
    async <R>(
      apiPromise: Promise<R>,
      optionsOverride: UseApiOptions = {}
    ): Promise<R | null> => {
      const mergedOptions: UseApiOptions = { ...defaultOptions, ...optionsOverride };

      const showSuccessOpt = mergedOptions.showSuccessNotification ?? false;
      const successMsgOpt = mergedOptions.successMessage ?? 'Operation completed successfully';
      const showErrorOpt = mergedOptions.showErrorNotification ?? true;
      const errorMsgOpt = mergedOptions.errorMessage;

      setLoading(true);
      setError(null);

      try {
        const result = await apiPromise;
        
        if (showSuccessOpt) {
          showSuccess(successMsgOpt);
        }
        
        setLoading(false);
        return result;
      } catch (err: any) {
        setError(err as Error);
        
        if (showErrorOpt) {
          let msgToShow: string;
          if (typeof errorMsgOpt === 'function') {
            msgToShow = errorMsgOpt(err);
          } else if (typeof errorMsgOpt === 'string') {
            msgToShow = errorMsgOpt;
          } else {
            msgToShow = getErrorMessage(err);
          }
          showError(msgToShow);
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
