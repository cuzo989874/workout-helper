import { useEffect, useState } from 'react';

export type TTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app_theme';

/**
 * Hook to manage theme state (light/dark mode)
 * Persists theme preference to localStorage and applies it to the document
 */
export function useTheme() {
  const [theme, setTheme] = useState<TTheme>(() => {
    // Try to get theme from localStorage
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }

    // Default to light mode
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    // Save to localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = (checked?: boolean) => {
    if (checked !== undefined) {
      setTheme(checked ? 'dark' : 'light');
    } else {
      setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    }
  };

  return { theme, setTheme, toggleTheme };
}
