import { useState, useEffect } from "react";

const themeKey = 'theme';

const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem(themeKey) || 'light';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.dataset.bsTheme = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.dataset.bsTheme = newTheme;
    localStorage.setItem(themeKey, newTheme);
  };

  return { theme, toggleTheme };
};

export default useTheme;