import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { theme as darkTheme } from "../../styles/theme";
import GlobalStyles from "../../styles/GlobalStyles";

const lightTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    primary: {
      ...darkTheme.colors.primary,
    },
    secondary: {
      ...darkTheme.colors.secondary,
    },
    background: {
      primary: "#ffffff",
      secondary: "#f5f5f5",
      tertiary: "#e8e8e8",
      paper: "#ffffff",
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#565656",
      disabled: "#9e9e9e",
      hint: "#767676",
    },
    divider: "rgba(0, 0, 0, 0.12)",
    highlight: "rgba(67, 97, 238, 0.15)",
  },
};

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeMode: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: ThemeMode;
}> = ({ children, initialTheme = "system" }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  const resolveSystemTheme = (): "light" | "dark" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  useEffect(() => {
    if (themeMode === "system") {
      setResolvedTheme(resolveSystemTheme());
    } else {
      setResolvedTheme(themeMode);
    }
  }, [themeMode]);

  useEffect(() => {
    if (themeMode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? "dark" : "light");
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    return undefined;
  }, [themeMode]);

  const isDarkMode = resolvedTheme === "dark";
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ themeMode, setTheme, isDarkMode, toggleTheme }}
    >
      <StyledThemeProvider theme={currentTheme}>
        <GlobalStyles theme={currentTheme} />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
};
