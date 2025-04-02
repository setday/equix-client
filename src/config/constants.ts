// API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 30000, // 30 seconds
};

// Default notification durations (in ms)
export const NOTIFICATION_DURATIONS = {
  ERROR: 6000,
  SUCCESS: 4000,
  WARNING: 5000,
  INFO: 4000,
};

// File types
export const ACCEPTED_FILE_TYPES = {
  PDF: 'application/pdf',
};

// App constants
export const APP = {
  NAME: 'Equix',
  VERSION: '0.1.0',
};
