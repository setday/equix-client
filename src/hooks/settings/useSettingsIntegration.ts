import { useEffect } from "react";
import { useSettings } from "./SettingsContext";

/**
 * Hook to synchronize settings with theme preferences
 * This hook should be used in components that need to react to settings changes
 */
export const useSettingsIntegration = () => {
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.debugMode) {
      console.log("Debug mode enabled", settings);
    }
  }, [settings]);

  return {
    settings,
  };
};
