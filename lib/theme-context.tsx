"use client";
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Provides theme to legacy chat widgets without touching document/localStorage. */
export function ThemeBridge({
  theme,
  children,
}: {
  theme: Theme;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => undefined,
      setTheme: () => undefined,
    }),
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeProvider({
  children,
  forcedTheme,
  defaultTheme = 'light',
}: {
  children: ReactNode;
  forcedTheme?: Theme;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(forcedTheme ?? defaultTheme);

  // Load theme from localStorage on mount
  useEffect(() => {
    if (forcedTheme) {
      setThemeState(forcedTheme);
      document.documentElement.classList.toggle('dark', forcedTheme === 'dark');
      return;
    }

    const savedTheme = localStorage.getItem('portfolio-theme') as Theme | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      setThemeState(defaultTheme);
      document.documentElement.classList.toggle('dark', defaultTheme === 'dark');
    }
  }, [forcedTheme, defaultTheme]);

  const setTheme = (newTheme: Theme) => {
    if (forcedTheme) return;

    setThemeState(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleTheme = () => {
    if (forcedTheme) return;

    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
