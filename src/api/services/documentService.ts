import { apiClient } from "../index";
import { LayoutResponse, GraphicsExtractionResponse } from "../../types";

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
    formData.append("document", file);

    const response = await apiClient.post<LayoutResponse>(
      "/layout-extraction",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
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
    format: "text" | "md" | "code" | "csv" | "json" = "text",
    prompt?: string,
  ): Promise<GraphicsExtractionResponse> => {
    const response = await apiClient.post<GraphicsExtractionResponse>(
      `/graphics-extraction`,
      {
        document_id: documentId,
        layout_block_id: blockId,
        output_type: format,
        prompt: prompt,
      },
    );

    return response.data;
  },

  /**
   * Ask a question about a document
   * @param documentId Document identifier
   * @param question Question text
   * @returns Promise with answer response
   */
  askQuestion: async (
    documentId: string,
    question: string,
  ): Promise<{ answer: string }> => {
    const response = await apiClient.post<{ answer: string }>(
      `/information-extraction`,
      {
        prompt: question,
        document_id: documentId,
      },
    );

    return response.data;
  },
};
