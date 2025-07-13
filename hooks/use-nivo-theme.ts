import { useEffect, useState } from 'react';
import { getCssVar } from '@/utils/common-utils';

export const useNivoTheme = (appTheme: 'light' | 'dark') => {
  const [theme, setTheme] = useState({});

  useEffect(() => {
    const textColor = getCssVar('--bs-body-color') || '#212529';
    const gridColor = getCssVar('--bs-border-color') || '#dee2e6';
    const tooltipBg = getCssVar('--bs-body-bg') || '#fff';
    const tooltipBorder = getCssVar('--bs-border-color-translucent') || gridColor;

    setTheme({
      textColor,
      axis: {
        domain: { line: { stroke: gridColor, strokeWidth: 1 } },
        ticks: {
          line: { stroke: gridColor, strokeWidth: 1 },
          text: { fill: textColor, fontSize: 10 },
        },
        legend: {
          text: { fill: textColor, fontSize: 12 },
        },
      },
      grid: { line: { stroke: gridColor, strokeWidth: 1 } },
      legends: { text: { fill: textColor, fontSize: 12 } },
      labels: { text: { fill: textColor, fontSize: 11 } },
      tooltip: {
        container: {
          background: tooltipBg,
          color: textColor,
          borderRadius: 4,
          boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
          fontSize: 12,
          border: `1px solid ${tooltipBorder}`,
          padding: '6px 9px',
        },
      },
    });
  }, [appTheme]); // <- runs every time theme changes

  return theme;
};