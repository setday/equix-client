// API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5123",
  TIMEOUT: 30000, // 30 seconds
};

export const NOTIFICATION_DURATIONS = {
  ERROR: 6000,
  SUCCESS: 4000,
  WARNING: 5000,
  INFO: 4000,
};

export const ACCEPTED_FILE_TYPES = {
  PDF: "application/pdf",
};

export const APP = {
  NAME: "Equix",
  VERSION: "1.0.0",
};

export const SETTINGS = {
  STORAGE_KEY: "equix-settings",
  MAX_FILE_SIZE_MB: 100,
  MIN_FILE_SIZE_MB: 1,
  DEFAULT_NOTIFICATION_DURATION: 4000,
  SUPPORTED_LANGUAGES: [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
  ],
  EXPORT_QUALITIES: [
    { value: "low", label: "Low (Fast)" },
    { value: "medium", label: "Medium (Balanced)" },
    { value: "high", label: "High (Best Quality)" },
  ],
};
