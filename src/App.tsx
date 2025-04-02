import "./App.css";
import React, { useEffect } from "react";
import { NotificationProvider } from './contexts/NotificationContext';
import MainLayout from './layouts/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { configurePdfWorker } from './utils/pdfWorkerConfig';

/**
 * Main application component that sets up the providers and layout
 */
function App(): JSX.Element {
  // Initialize the PDF.js worker when the app loads
  useEffect(() => {
    configurePdfWorker();
  }, []);

  return (
    <ErrorBoundary>
      <ThemeContextProvider>
        <NotificationProvider>
          <MainLayout />
        </NotificationProvider>
      </ThemeContextProvider>
    </ErrorBoundary>
  );
}

export default App;