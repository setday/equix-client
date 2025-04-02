import { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { getErrorMessage } from '../utils/apiErrorHandler';
import { documentService } from '../api';
import { LayoutResponse, GraphicsExtractionResponse } from '../types';

interface ApiStateLoading {
  [key: string]: boolean;
}

interface ApiStateErrors {
  [key: string]: string | null;
}

interface ApiState {
  loading: ApiStateLoading;
  errors: ApiStateErrors;
}

/**
 * Hook for handling API calls with integrated notification system
 */
export function useApi() {
  const [state, setState] = useState<ApiState>({
    loading: {},
    errors: {}
  });
  const { showError, showSuccess } = useNotification();

  const setLoading = (key: string, isLoading: boolean): void => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: isLoading }
    }));
  };

  const setError = (key: string, error: string | null): void => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [key]: error }
    }));
  };

  /**
   * Extract layout from a PDF file with notification handling
   */
  const extractLayout = async (file: File): Promise<LayoutResponse | null> => {
    const operationKey = 'extractLayout';
    setLoading(operationKey, true);
    setError(operationKey, null);
    
    try {
      const response = await documentService.extractLayout(file);
      showSuccess('PDF layout extracted successfully');
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(operationKey, errorMessage);
      showError(`Failed to extract layout: ${errorMessage}`);
      return null;
    } finally {
      setLoading(operationKey, false);
    }
  };

  /**
   * Extract graphics with notification handling
   */
  const extractGraphics = async (
    documentId: string,
    blockId: number,
    format: 'Markdown' | 'HTML' | 'Plain' = 'Markdown'
  ): Promise<GraphicsExtractionResponse | null> => {
    const operationKey = 'extractGraphics';
    setLoading(operationKey, true);
    setError(operationKey, null);

    try {
      const response = await documentService.extractGraphics(documentId, blockId, format);
      showSuccess('Graphics extracted successfully');
      return response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(operationKey, errorMessage);
      showError(`Failed to extract graphics: ${errorMessage}`);
      return null;
    } finally {
      setLoading(operationKey, false);
    }
  };

  /**
   * Ask a question about the document
   */
  const askQuestion = async (
    documentId: string,
    question: string
  ): Promise<string | null> => {
    const operationKey = 'askQuestion';
    setLoading(operationKey, true);
    setError(operationKey, null);

    try {
      const response = await documentService.askQuestion(documentId, question);
      return response.answer;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(operationKey, errorMessage);
      showError(`Failed to process question: ${errorMessage}`);
      return null;
    } finally {
      setLoading(operationKey, false);
    }
  };

  return {
    loading: state.loading,
    errors: state.errors,
    extractLayout,
    extractGraphics,
    askQuestion
  };
}
