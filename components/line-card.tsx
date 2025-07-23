"use client";
import React from 'react';
import { Card } from "react-bootstrap";
import LineChart from './line-chart';

interface SeriesPoint {
  x: string | number;
  y: number;
}

interface Series {
  id: string; // legend label
  data: SeriesPoint[];
}

interface LineCardProps {
  title?: string;
  data: Series[];
  maxTickLabelLength?: number;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
  xAxisLabel?: string;
  yAxisLabel?: string;
  integerOnlyYTicks?: boolean;
  showArea?: boolean;
}

const LineCard: React.FC<LineCardProps> = ({
  title,
  data,
  maxTickLabelLength = 6,
  tickLabelFormat = 'truncate',
  xAxisLabel,
  yAxisLabel,
  integerOnlyYTicks,
  showArea,
}) => {
  return (
    <Card>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        <LineChart
          data={data}
          maxTickLabelLength={maxTickLabelLength}
          tickLabelFormat={tickLabelFormat}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          integerOnlyYTicks={integerOnlyYTicks}
          showArea={showArea}
        />
      </Card.Body>
    </Card>
  );
};

export default LineCard;