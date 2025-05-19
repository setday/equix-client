import { documentService } from '../api';
import { LayoutResponse, GraphicsExtractionResponse } from '../types';
import { useApiWithNotification } from './useApiWithNotification';

/**
 * Hook for handling specific API calls using a generic notification-aware API caller.
 */
export function useApi() {
  const { callApi, loading, error } = useApiWithNotification({
    showSuccessNotification: true,
    showErrorNotification: true,
  });

  /**
   * Extract layout from a PDF file with notification handling
   */
  const extractLayout = async (file: File): Promise<LayoutResponse | null> => {
    return callApi(
      documentService.extractLayout(file),
      {
        successMessage: 'PDF layout extracted successfully',
        errorMessage: (err) => `Failed to extract layout: ${err.message || 'Unknown error'}`
      }
    );
  };

  /**
   * Extract graphics with notification handling
   */
  const extractGraphics = async (
    documentId: string,
    blockId: number,
    format: 'Markdown' | 'HTML' | 'Plain' = 'Markdown'
  ): Promise<GraphicsExtractionResponse | null> => {
    return callApi(
      documentService.extractGraphics(documentId, blockId, format),
      {
        successMessage: 'Graphics extracted successfully',
        errorMessage: (err) => `Failed to extract graphics: ${err.message || 'Unknown error'}`
      }
    );
  };

  /**
   * Ask a question about the document
   */
  const askQuestion = async (
    documentId: string,
    question: string
  ): Promise<{ answer: string } | null> => {
    return callApi<{ answer: string }>(
      documentService.askQuestion(documentId, question),
      {
        successMessage: 'Question processed successfully',
        errorMessage: (err) => `Failed to process question: ${err.message || 'Unknown error'}`
      }
    );
  };

  return {
    loading,
    error,
    extractLayout,
    extractGraphics,
    askQuestion
  };
}
