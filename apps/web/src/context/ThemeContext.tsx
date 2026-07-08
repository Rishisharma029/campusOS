import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeProfile = 'light' | 'dark' | 'ocean' | 'forest';

interface ThemeContextType {
  theme: ThemeProfile;
  setTheme: (profile: ThemeProfile) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeProfile>(() => {
    const saved = localStorage.getItem('theme_profile');
    if (saved === 'light' || saved === 'dark' || saved === 'ocean' || saved === 'forest') {
      return saved;
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Clear existing theme classes
    root.classList.remove('dark', 'theme-ocean', 'theme-forest');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'ocean') {
      root.classList.add('theme-ocean');
    } else if (theme === 'forest') {
      root.classList.add('theme-forest');
    }

    localStorage.setItem('theme_profile', theme);
  }, [theme]);

  const setTheme = (profile: ThemeProfile) => {
    setThemeState(profile);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'ocean';
      if (prev === 'ocean') return 'forest';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
