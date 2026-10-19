import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const KEY = 'robocraft_theme';

function initialTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  // Respect system preference; default to dark when not explicitly light.
  try {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  } catch {}
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem(KEY, theme); } catch {}
  }, [theme]);

  const toggle = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
