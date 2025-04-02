import { apiClient } from '../index';
import { LayoutResponse, GraphicsExtractionResponse } from '../../types';

/**
 * Service for document-related API operations
 */
export const documentService = {
  /**
   * Extract layout from a PDF file
   * @param file The PDF file to extract layout from
   * @returns Promise with layout response
   */
  extractLayout: async (file: File): Promise<LayoutResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<LayoutResponse>(
      '/extract-layout', 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Extract graphics from a document with specific format
   * @param documentId Document identifier
   * @param blockId Block identifier
   * @param format Output format (Markdown, HTML, or Plain)
   * @returns Promise with extracted graphics data
   */
  extractGraphics: async (
    documentId: string,
    blockId: number,
    format: 'Markdown' | 'HTML' | 'Plain' = 'Markdown'
  ): Promise<GraphicsExtractionResponse> => {
    const response = await apiClient.get<GraphicsExtractionResponse>(
      `/documents/${documentId}/blocks/${blockId}/graphics`,
      {
        params: { format }
      }
    );

    return response.data;
  },

  /**
   * Ask a question about a document
   * @param documentId Document identifier
   * @param question Question text
   * @returns Promise with answer response
   */
  askQuestion: async (documentId: string, question: string): Promise<{answer: string}> => {
    const response = await apiClient.post(`/documents/${documentId}/query`, {
      prompt: question
    });
    
    return response.data;
  }
};
