import { useCallback } from 'react';
import { usePDFFileStore } from '../stores/pdfFileStore';
import type { UnlistenFn } from '@tauri-apps/api/event';
import { useNotification } from '../contexts/NotificationContext';
import { fs } from '@tauri-apps/api';
import { ACCEPTED_FILE_TYPES } from '../config/constants';

interface FileDropHandlerHook {
  fileDropHandler: () => Promise<UnlistenFn>;
}

/**
 * Hook to handle file drop events from Tauri
 */
export function useFileDropHandler(): FileDropHandlerHook {
  const { setPDFFile } = usePDFFileStore();
  const { showError, showInfo } = useNotification();
  
  const fileDropHandler = useCallback(async (): Promise<UnlistenFn> => {
    try {
      const { listen } = await import('@tauri-apps/api/event');
      
      // Listen for file drop events
      const unlisten = await listen<string[]>("tauri://file-drop", async (event) => {
        const filePaths: string[] = event.payload;
        
        if (filePaths.length === 0) {
          return;
        }
        
        if (filePaths.length > 1) {
          showInfo('Multiple files detected. Processing only the first PDF file.');
        }
        
        const filePath = filePaths[0];
        
        // Check if the file is a PDF
        if (!filePath.toLowerCase().endsWith('.pdf')) {
          showError('Unsupported file format. Please drop a PDF file.');
          return;
        }
        
        try {
          showInfo('Loading PDF file...');
          
          // Read the file as binary
          const fileBytes = await fs.readBinaryFile(filePath);
          const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'document.pdf';
          
          // Create a File object from the binary data
          const file = new File(
            [new Blob([new Uint8Array(fileBytes)])], 
            fileName,
            { type: ACCEPTED_FILE_TYPES.PDF }
          );
          
          // Set the file in store which will trigger layout detection
          setPDFFile(file);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 
            typeof error === 'string' ? error : 'Unknown error';
          showError(`Failed to load PDF file: ${errorMessage}`);
        }
      });
      
      return unlisten;
    } catch (error) {
      console.error('Failed to set up file drop handler:', error);
      showError('Failed to initialize file drop functionality');
      
      // Return a dummy unlisten function
      return () => Promise.resolve();
    }
  }, [setPDFFile]);
  
  return { fileDropHandler };
}
