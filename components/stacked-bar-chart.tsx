'use client';
import { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useNivoTheme } from '@/hooks/use-nivo-theme';
import { useTheme } from '@/hooks/useTheme';
import { useContainerWidth } from '@/hooks/use-container-width';
import { formatChartTickLabel } from '@/utils/common-utils';

interface StackedBarChartProps {
  data: {
    [key: string]: string | number;
  }[];
  keys: string[];
  indexBy: string;
  maxTickLabelLength?: number;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
  xAxisLabel?: string;
  yAxisLabel?: string;
  integerOnlyYTicks?: boolean;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  keys,
  indexBy,
  maxTickLabelLength = 6,
  tickLabelFormat = 'truncate',
  xAxisLabel,
  yAxisLabel,
  integerOnlyYTicks,
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
        colors={{ scheme: 'tableau10' }}
        valueScale={{ type: 'linear', nice: true, round: true, min: 0, max: 'auto', reverse: false, clamp: false }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: axisBottomTickRotation,
          legend: xAxisLabel ?? indexBy,
          legendPosition: 'middle',
          legendOffset: 40,
          tickValues,
          format: (value) =>
            typeof value === 'string'
              ? formatChartTickLabel(value, tickLabelFormat, maxTickLabelLength)
              : value,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: yAxisLabel ?? keys.join(', '),
          legendPosition: 'middle',
          legendOffset: -50,
          format: integerOnlyYTicks
            ? (value) => (Number.isInteger(value) ? value : '')
            : undefined,
        }}
        legends={
          [
            {
                dataFrom: 'keys',
                anchor: 'top-left',
                direction: 'column',
                translateX: 10,
                translateY: 0,
                itemsSpacing: 3,
                itemWidth: 100,
                itemHeight: 25
            }
          ]
        }
        enableLabel={false} // disable the number on the bar
        animate={true}
        role="application"
        ariaLabel="Stacked bar chart"
        groupMode="stacked"
      />
    </div>
  );
};

export default StackedBarChart;