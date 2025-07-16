'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useNivoTheme } from '@/hooks/use-nivo-theme';
import { useTheme } from '@/hooks/useTheme';
import { useContainerWidth } from '@/hooks/use-container-width';
const ReactD3WordCloud = dynamic(() => import('react-d3-cloud'), { ssr: false, });

type Word = { text: string; value: number };

interface WordCloudChartProps {
  data: Word[];
  hrefBase?: string;
  newTab?: boolean;
}

const WordCloudChart: React.FC<WordCloudChartProps> = ({
  data,
  hrefBase = 'https://www.google.com/search?q=',
  newTab = true,
}) => {
  const { theme } = useTheme();
  const nivoTheme = useNivoTheme(theme);
  const { ref, width } = useContainerWidth();

  useEffect(() => {
    
  }, [width]);

  return (
    <div ref={ref} style={{ height: (width * 0.9), width: '100%' }}>
      { width > 0 && (
        <ReactD3WordCloud
          width={width}
          height={(width * 0.9)}
          data={data}
          font="Times"
          fontSize={(word) => 14 + Math.log2(word.value) * 6}
          spiral="rectangular"
          rotate={() => ~~(Math.random() * 2) * 90}     /* 0° or 90° */
          padding={3}
          onWordMouseOver={(e) =>
            ((e.target as SVGTextElement).style.cursor = 'pointer')
          }
          onWordMouseOut={(e) =>
            ((e.target as SVGTextElement).style.cursor = 'default')
          }
          onWordClick={(e, w) => {
            const url = `${hrefBase}${encodeURIComponent(w.text)}`;
            window.open(url, newTab ? '_blank' : '_self');
          }}
        />
      )}
    </div>
  );
};

export default WordCloudChart;