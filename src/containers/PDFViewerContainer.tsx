import { useState, useEffect, useCallback } from "react";
import PDFViewer from "../components/PDFViewer/PDFViewer";
import { DocumentLayout } from "../types";
import { usePDFFileStore } from "../stores/pdfFileStore";
import { useNotification } from "../contexts/NotificationContext";
import { documentService } from "../api";

/**
 * Container for handling PDF viewer state and logic
 */
const PDFViewerContainer: React.FC = (): JSX.Element => {
  const { pdfFile, isNewFile, acknowledgeFile } = usePDFFileStore();
  const [documentLayout, setDocumentLayout] = useState<DocumentLayout | null>(null);
  const { showError, showSuccess } = useNotification();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processFile = useCallback(async (file: File): Promise<void> => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setDocumentLayout(null);
    
    try {
      const data = await documentService.extractLayout(file);
      if (data) {
        setDocumentLayout(data.layout);
        showSuccess('Document structure analyzed successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(`Failed to process PDF: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
      acknowledgeFile(); // Mark file as processed
    }
  }, [isProcessing, showSuccess, showError, acknowledgeFile]);

  // Process file effect
  useEffect(() => {
    if (pdfFile && isNewFile) {
      processFile(pdfFile);
    }
  }, [pdfFile, isNewFile, processFile]);
  
  const handleCancel = useCallback(() => {
    setIsProcessing(false);
    acknowledgeFile();
  }, [acknowledgeFile]);

  return (
    <PDFViewer
      file={pdfFile} 
      documentLayout={documentLayout} 
      isLoading={isProcessing}
      onCancel={handleCancel}
    />
  );
};

export default PDFViewerContainer;
