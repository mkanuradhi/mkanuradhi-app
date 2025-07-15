'use client';
import { useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useNivoTheme } from '@/hooks/use-nivo-theme';
import { useTheme } from '@/hooks/useTheme';
import { useContainerWidth } from '@/hooks/use-container-width';
import { formatChartTickLabel } from '@/utils/common-utils';
import { BasicTooltip } from '@nivo/tooltip';

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
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  innerRadius,
  maxTickLabelLength = 6,
  tickLabelFormat = 'truncate',
}) => {
  const { theme } = useTheme();
  const nivoTheme = useNivoTheme(theme);
  const { ref, width } = useContainerWidth();

  useEffect(() => {
    
  }, [width]);

  return (
    <div ref={ref} style={{ height: 400, width: '100%' }}>
      <ResponsivePie
        data={data}
        theme={nivoTheme}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={innerRadius}
        padAngle={0.6}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'tableau10' }}
        arcLinkLabel={d => formatChartTickLabel(d.data.label ?? '', tickLabelFormat, maxTickLabelLength)}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsThickness={1}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        tooltip={({ datum }) => (
          <BasicTooltip
            id={datum.data.label}
            value={datum.value}
            color={datum.color}
          />
        )}
        legends={
          [
            {
              anchor: 'bottom',
              direction: 'row',
              translateY: 56,
              itemWidth: 140,
              itemHeight: 18,
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