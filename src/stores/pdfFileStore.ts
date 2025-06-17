import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface FileMetadata {
  lastModified: number | null;
  name: string | null;
  size: number | null;
  type: string | null;
}

interface PDFFileState {
  pdfFile: File | null;
  fileMetadata: FileMetadata;
  isNewFile: boolean;
  isLoading: boolean;
  error: string | null;
  setPDFFile: (file: File) => void;
  clearPDFFile: () => void;
  acknowledgeFile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Store for managing PDF file state across the application
 * Uses subscribeWithSelector to allow components to subscribe to specific state changes
 */
export const usePDFFileStore = create<PDFFileState>()(
  subscribeWithSelector((set) => ({
    pdfFile: null,
    fileMetadata: {
      lastModified: null,
      name: null,
      size: null,
      type: null,
    },
    isNewFile: false,
    isLoading: false,
    error: null,

    setPDFFile: (file: File) =>
      set({
        pdfFile: file,
        fileMetadata: {
          lastModified: file.lastModified,
          name: file.name,
          size: file.size,
          type: file.type,
        },
        isNewFile: true,
        error: null,
      }),

    clearPDFFile: () =>
      set({
        pdfFile: null,
        fileMetadata: {
          lastModified: null,
          name: null,
          size: null,
          type: null,
        },
        isNewFile: false,
        isLoading: false,
        error: null,
      }),

    acknowledgeFile: () =>
      set({
        isNewFile: false,
      }),

    setLoading: (loading: boolean) =>
      set({
        isLoading: loading,
      }),

    setError: (error: string | null) =>
      set({
        error,
        isLoading: false,
      }),
  })),
);
