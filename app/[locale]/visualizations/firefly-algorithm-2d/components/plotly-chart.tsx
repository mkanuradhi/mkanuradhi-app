"use client";
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const baseTPath = 'components.Ffy2DContainer';

function PlotlyLoading() {
  const t = useTranslations(baseTPath);
  
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">{t('chartLoadingLabel')}</span>
        </div>
        <p className="text-muted">{t('chartLoadingLabel')}</p>
      </div>
    </div>
  );
}

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: PlotlyLoading
});

export default Plot;