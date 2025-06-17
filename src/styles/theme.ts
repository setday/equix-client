export const theme = {
  colors: {
    primary: {
      main: "#4361EE",
      light: "#4CC9F0",
      dark: "#3A0CA3",
      contrast: "#ffffff",
    },
    secondary: {
      main: "#F72585",
      light: "#FF85A1",
      dark: "#7209B7",
      contrast: "#ffffff",
    },
    neutral: {
      100: "#ffffff",
      200: "#f5f5f5",
      300: "#e0e0e0",
      400: "#b0b0b0",
      500: "#909090",
      600: "#707070",
      700: "#505050",
      800: "#303030",
      900: "#1a1a1a",
    },
    success: "#52C41A",
    error: "#FF4D4F",
    warning: "#FAAD14",
    info: "#1890FF",
    background: {
      primary: "#242933",
      secondary: "#1A1E27",
      tertiary: "#2E3440",
      paper: "#FaFaFa",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      primary: "#ECEFF4",
      secondary: "#D8DEE9",
      disabled: "#4C566A",
      hint: "#81A1C1",
    },
    divider: "rgba(255, 255, 255, 0.12)",
    highlight: "rgba(67, 97, 238, 0.15)",
  },
  typography: {
    fontFamily: {
      primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      mono: '"Roboto Mono", "Courier New", monospace',
    },
    fontSizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      md: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      xxl: "1.5rem", // 24px
      xxxl: "2rem", // 32px
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },
  spacing: {
    xxs: "0.25rem", // 4px
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    xxl: "3rem", // 48px
  },
  sizes: {
    headerHeight: "64px",
    sidebarWidth: "280px",
    maxContentWidth: "1600px",
  },
  borderRadius: {
    xs: "2px",
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    round: "50%",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
    lg: "0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 40px rgba(0, 0, 0, 0.15)",
    inner: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  transitions: {
    default: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
};

export type Theme = typeof theme;
