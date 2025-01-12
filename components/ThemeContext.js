import React, { createContext, useState, useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = {
    primary: '#4CAF50',
    background: isDarkMode ? '#151515' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    cardBackground: isDarkMode ? '#1E1E1E' : '#F8F8F8',
    toggleTheme,
    isDarkMode,
  };

  // Update the StatusBar style dynamically
  useEffect(() => {
    if (isDarkMode) {
      StatusBar.setBarStyle('light-content', true); // Light text on dark background
    } else {
      StatusBar.setBarStyle('dark-content', true); // Dark text on light background
    }
  }, [isDarkMode]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
