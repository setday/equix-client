import React, { useState, useEffect, useCallback } from "react";
import PDFViewer from "../components/PDFViewer/PDFViewer";
import { DocumentLayout, ChatMessage } from "../types";
import { usePDFFileStore } from "../stores/pdfFileStore";
import { useNotification } from "../hooks/notification/NotificationContext";
import { documentService } from "../api";

interface PDFViewerContainerProps {
  onAddMessage?: (message: Partial<ChatMessage>) => void;
}

/**
 * Container for handling PDF viewer state and logic
 */
const PDFViewerContainer: React.FC<PDFViewerContainerProps> = ({
  onAddMessage,
}): JSX.Element => {
  const { pdfFile, isNewFile, acknowledgeFile } = usePDFFileStore();
  const [documentLayout, setDocumentLayout] = useState<DocumentLayout | null>(
    null,
  );
  const { showError, showSuccess } = useNotification();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processFile = useCallback(
    async (file: File): Promise<void> => {
      if (isProcessing) return;

      setIsProcessing(true);
      setDocumentLayout(null);

      try {
        const data = await documentService.extractLayout(file);
        if (data) {
          setDocumentLayout(data.layout);
          showSuccess("Document structure analyzed successfully");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        showError(`Failed to process PDF: ${errorMessage}`);
      } finally {
        setIsProcessing(false);
        acknowledgeFile();
      }
    },
    [isProcessing, showSuccess, showError, acknowledgeFile],
  );

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
      onAddMessage={onAddMessage}
    />
  );
};

export default React.memo(PDFViewerContainer);
