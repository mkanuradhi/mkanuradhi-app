"use client";
import React from 'react';
import { Card } from "react-bootstrap";
import BarChart from './bar-chart';

interface BarCardProps {
  title?: string;
  data: { [key: string]: string | number }[];
  keys: string[];
  indexBy: string;
  maxTickLabelLength?: number;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
  xAxisLabel?: string;
  yAxisLabel?: string;
  integerOnlyYTicks?: boolean;
}

const BarCard: React.FC<BarCardProps> = ({
  title,
  data,
  keys,
  indexBy,
  maxTickLabelLength = 6,
  tickLabelFormat = 'initials',
  xAxisLabel,
  yAxisLabel,
  integerOnlyYTicks,
}) => {
  return (
    <Card className="h-100">
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        <BarChart
          data={data}
          keys={keys}
          indexBy={indexBy}
          maxTickLabelLength={maxTickLabelLength}
          tickLabelFormat={tickLabelFormat}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          integerOnlyYTicks={integerOnlyYTicks}
        />
      </Card.Body>
    </Card>
  );
};

export default BarCard;