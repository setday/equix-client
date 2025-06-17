import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { API_CONFIG } from "../../config/constants";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  backendUrl: string;
  artifactsPath: string;
  autoSaveEnabled: boolean;
  notificationDuration: number;
  maxFileSize: number; // in MB
  language: string;
  exportQuality: "low" | "medium" | "high";
  debugMode: boolean;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => boolean;
}

const defaultSettings: AppSettings = {
  theme: "system",
  backendUrl: API_CONFIG.BASE_URL,
  artifactsPath: "",
  autoSaveEnabled: true,
  notificationDuration: 4000,
  maxFileSize: 50, // 50MB
  language: "en",
  exportQuality: "high",
  debugMode: false,
};

const SETTINGS_STORAGE_KEY = "equix-settings";

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((settingsJson: string) => {
    try {
      const parsed = JSON.parse(settingsJson);
      if (typeof parsed === "object" && parsed !== null) {
        const validatedSettings = { ...defaultSettings, ...parsed };
        setSettings(validatedSettings);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to import settings:", error);
      return false;
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      settings,
      updateSetting,
      resetSettings,
      exportSettings,
      importSettings,
    }),
    [settings, updateSetting, resetSettings, exportSettings, importSettings],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
