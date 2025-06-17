import { useEffect } from "react";
import { useSettings } from "../settings/SettingsContext";
import { useTheme } from "./ThemeContext";

/**
 * Hook to synchronize settings theme with ThemeContext
 */
export const useThemeIntegration = () => {
  const { settings } = useSettings();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(settings.theme);
  }, [settings.theme, setTheme]);
};
