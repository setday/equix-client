import { GlobalWorkerOptions } from "pdfjs-dist";

/**
 * PDF.js version used in the application
 * Update this constant when upgrading the library
 */
const PDFJS_VERSION = "3.11.174";

/**
 * Configure the PDF.js worker
 * This should be called once when the application starts
 */
export const configurePdfWorker = (): void => {
  if (GlobalWorkerOptions.workerSrc) {
    return;
  }

  GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
};
