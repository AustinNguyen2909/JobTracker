import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { themes, shared } from '../theme';
import type { ThemeName, ThemeContextValue } from '../types';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(themeName: ThemeName): void {
  const root = document.documentElement;
  const vars = themes[themeName];

  (Object.entries(vars) as [string, string][]).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  (Object.entries(shared) as [string, string][]).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.setAttribute('data-theme', themeName);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('job-tracker-theme');
    return (saved === 'light' ? 'light' : 'dark') as ThemeName;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('job-tracker-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
