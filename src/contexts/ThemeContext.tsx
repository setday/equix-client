import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme as darkTheme } from '../theme';
import GlobalStyles from '../styles/GlobalStyles';

// Create a light theme variant
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
      primary: '#ffffff',
      secondary: '#f5f5f5',
      tertiary: '#e8e8e8',
      paper: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#565656',
      disabled: '#9e9e9e',
      hint: '#767676',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
};

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Try to get the theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('themeMode') as ThemeMode | null;
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const isDarkMode = themeMode === 'dark';
  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('themeMode', newTheme);
      return newTheme;
    });
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if the user hasn't set a preference
      if (!localStorage.getItem('themeMode')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    
    return undefined;
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme, isDarkMode }}>
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
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  return context;
};
