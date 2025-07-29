'use client';
import { useEffect, useMemo } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useNivoTheme } from '@/hooks/use-nivo-theme';
import { useTheme } from '@/hooks/useTheme';
import { useContainerWidth } from '@/hooks/use-container-width';
import { formatChartTickLabel } from '@/utils/common-utils';

interface PieChartProps {
  data: {
    id: string;
    value: number;
    label?: string;
    color?: string;
  }[];
  innerRadius?: number;
  maxTickLabelLength?: number;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
  heightPropotion?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  innerRadius,
  maxTickLabelLength = 6,
  tickLabelFormat = 'truncate',
  heightPropotion = 9/16, // 16:9 aspect ratio
}) => {
  const { theme } = useTheme();
  const nivoTheme = useNivoTheme(theme);
  const { ref, width } = useContainerWidth();
  const height = Math.max(200, Math.round(width * heightPropotion));

  const filteredData = useMemo(() => data.filter(d => d.value > 0), [data]);

  useEffect(() => {
    
  }, [width]);

  return (
    <div ref={ref} style={{ height: height, width: '100%' }}>
      <ResponsivePie
        data={filteredData}
        theme={nivoTheme}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={innerRadius}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'tableau10' }}
        arcLinkLabel={d => formatChartTickLabel(d.data.id, tickLabelFormat, maxTickLabelLength)}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsThickness={1}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={
          [
            {
              anchor: 'bottom',
              direction: 'row',
              translateY: 56,
              itemWidth: 100,
              itemHeight: 18,
              itemsSpacing: 16,
              symbolShape: 'circle',
            }
          ]
        }
        animate={true}
        role="application"
      />
    </div>
  );
};

export default PieChart;