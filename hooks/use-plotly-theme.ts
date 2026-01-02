// hooks/use-plotly-theme.ts
import { useEffect, useState } from 'react';
import { getCssVar } from '@/utils/common-utils';

interface PlotlyTheme {
  plot_bg: string;
  paper_bg: string;
  grid_color: string;
  zeroline_color: string;
  text_color: string;
  title_color: string;
}

export const usePlotlyTheme = (appTheme: 'light' | 'dark'): PlotlyTheme => {
  const [theme, setTheme] = useState<PlotlyTheme>({
    plot_bg: '#f8f9fa',
    paper_bg: '#ffffff',
    grid_color: '#dee2e6',
    zeroline_color: '#adb5bd',
    text_color: '#212529',
    title_color: '#212529',
  });

  useEffect(() => {
    // Get colors from Bootstrap CSS variables
    const bodyBg = getCssVar('--bs-body-bg') || '#ffffff';
    const bodyColor = getCssVar('--bs-body-color') || '#212529';
    const borderColor = getCssVar('--bs-border-color') || '#dee2e6';
    const secondaryColor = getCssVar('--bs-secondary-color') || '#6c757d';
    
    // For plot background, use a slightly different shade than body
    const plotBg = appTheme === 'dark'
      ? getCssVar('--bs-tertiary-bg') || '#1a1a1a'
      : getCssVar('--bs-light') || '#f8f9fa';

    setTheme({
      plot_bg: plotBg,
      paper_bg: bodyBg,
      grid_color: borderColor,
      zeroline_color: secondaryColor,
      text_color: bodyColor,
      title_color: bodyColor,
    });
  }, [appTheme]); // Runs every time theme changes

  return theme;
};