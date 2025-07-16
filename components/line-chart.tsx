'use client';
import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line'
import { useNivoTheme } from '@/hooks/use-nivo-theme';
import { useTheme } from '@/hooks/useTheme';
import { useContainerWidth } from '@/hooks/use-container-width';
import { formatChartTickLabel } from '@/utils/common-utils';

interface SeriesPoint {
  x: string | number;
  y: number;
}

interface Series {
  id: string; // legend label
  data: SeriesPoint[];
}

interface LineChartProps {
  data: Series[];
  maxTickLabelLength?: number;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
  xAxisLabel?: string;
  yAxisLabel?: string;
  integerOnlyYTicks?: boolean;
  showArea?: boolean; // optional fill under the line
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  maxTickLabelLength = 6,
  tickLabelFormat = 'truncate',
  xAxisLabel,
  yAxisLabel,
  integerOnlyYTicks,
  showArea = false,
}) => {
  const { theme } = useTheme();
  const nivoTheme = useNivoTheme(theme);
  const { ref, width } = useContainerWidth();

  const [axisBottomTickRotation, setAxisBottomTickRotation] = useState(0);

  useEffect(() => {
    setAxisBottomTickRotation(width < 300 ? -90 : width < 600 ? -45 : 0);
  }, [width]);

  // Calculate tick skipping based on data length
  const xs = [...new Set(data.flatMap(s => s.data.map(d => d.x as string)))];
  let skip = 1;
  if (xs.length > 30) {
    skip = 5;
  } else if (xs.length > 15) {
    skip = 2;
  }
  const tickValues = xs.filter((_, i) => i % skip === 0);

  return (
    <div ref={ref} style={{ height: (width * 0.9), width: '100%' }}>
      <ResponsiveLine
        data={data}
        theme={nivoTheme}
        margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
        colors={{ scheme: 'tableau10' }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
        enableArea={showArea}
        pointSize={6}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'seriesColor' }}
        pointLabelYOffset={-12}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: axisBottomTickRotation,
          legend: xAxisLabel,
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
          legend: yAxisLabel,
          legendPosition: 'middle',
          legendOffset: -50,
          format: integerOnlyYTicks
            ? (value) => (Number.isInteger(value) ? value : '')
            : undefined,
        }}
        legends={
          [
            {
              anchor: 'top-left',
              direction: 'column',
              translateX: 10,
              translateY: 0,
              itemsSpacing: 3,
              itemWidth: 100,
              itemHeight: 25,
              symbolShape: 'circle',
            }
          ]
        }
        enableTouchCrosshair={true}
        useMesh={true}
        animate={true}
        role="application"
        ariaLabel="Line chart"
      />
    </div>
  );
};

export default LineChart;