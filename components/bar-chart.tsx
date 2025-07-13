'use client';
import { ResponsiveBar } from '@nivo/bar';
import { useNivoTheme } from '@/hooks/use-nivo-theme';
import { useTheme } from '@/hooks/useTheme';
import { useContainerWidth } from '@/hooks/use-container-width';
import { useEffect, useState } from 'react';

interface BarChartProps {
  data: {
    [key: string]: string | number;
  }[];
  keys: string[];
  indexBy: string;
  maxTickLabelLength?: number;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
}

const formatTickLabel = (label: string, format: 'truncate' | 'initials' | 'full', maxLen: number): string => {
  if (label.length <= maxLen || format === 'full') return label;

  if (format === 'truncate') {
    return `${label.slice(0, maxLen)}…`;
  }

  if (format === 'initials') {
    return label
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  return label; // fallback
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  keys,
  indexBy,
  maxTickLabelLength = 6,
  tickLabelFormat = 'truncate',
}) => {
  const { theme } = useTheme();
  const nivoTheme = useNivoTheme(theme);
  const { ref, width } = useContainerWidth();

  const [axisBottomTickRotation, setAxisBottomTickRotation] = useState(0);

  useEffect(() => {
    if (width < 300) {
      setAxisBottomTickRotation(-90);
    } else if (width < 600) {
      setAxisBottomTickRotation(-45);
    } else {
      setAxisBottomTickRotation(0);
    }
  }, [width]);

  // Calculate tick skipping based on data length
  let skip = 1;
  if (data.length > 30) {
    skip = 5;
  } else if (data.length > 15) {
    skip = 2;
  }
  const tickValues = data
    .filter((_, i) => i % skip === 0)
    .map(d => d[indexBy] as string);

  return (
    <div ref={ref} style={{ height: 400, width: '100%' }}>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        theme={nivoTheme}
        margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: axisBottomTickRotation,
          legend: indexBy,
          legendPosition: 'middle',
          legendOffset: 40,
          tickValues,
          format: (value) =>
            typeof value === 'string'
              ? formatTickLabel(value, tickLabelFormat, maxTickLabelLength)
              : value,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: keys[0],
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        animate={true}
        role="application"
        ariaLabel="Bar chart"
      />
    </div>
  );
};

export default BarChart;