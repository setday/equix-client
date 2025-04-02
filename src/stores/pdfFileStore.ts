import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

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
      type: null
    },
    isNewFile: false,
    isLoading: false,
    error: null,
    
    // Set a new PDF file and mark it as new
    setPDFFile: (file: File) => set({
      pdfFile: file,
      fileMetadata: {
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type
      },
      isNewFile: true,
      error: null
    }),
    
    // Clear the current PDF file
    clearPDFFile: () => set({
      pdfFile: null,
      fileMetadata: {
        lastModified: null,
        name: null,
        size: null,
        type: null
      },
      isNewFile: false,
      isLoading: false,
      error: null
    }),
    
    // Acknowledge that the file has been processed
    acknowledgeFile: () => set({
      isNewFile: false
    }),
    
    // Set loading state
    setLoading: (loading: boolean) => set({
      isLoading: loading
    }),
    
    // Set error state
    setError: (error: string | null) => set({
      error,
      isLoading: false
    })
  }))
);
