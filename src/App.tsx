import "./App.css";
import { useEffect } from "react";
import { NotificationProvider } from "./hooks/notification/NotificationContext";
import { SettingsProvider } from "./hooks/settings/SettingsContext";
import MainLayout from "./layouts/MainLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeContextProvider } from "./hooks/theme/ThemeContext";
import { configurePdfWorker } from "./config/pdfWorkerConfig";
import { useThemeIntegration } from "./hooks/theme/useThemeIntegration";

/**
 * Theme integration component that connects settings to theme
 */
const ThemeIntegration: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useThemeIntegration();
  return <>{children}</>;
};

/**
 * Main application component that sets up the providers and layout
 */
function App(): JSX.Element {
  useEffect(() => {
    configurePdfWorker();
  }, []);

  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ThemeContextProvider>
          <ThemeIntegration>
            <NotificationProvider>
              <MainLayout />
            </NotificationProvider>
          </ThemeIntegration>
        </ThemeContextProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
