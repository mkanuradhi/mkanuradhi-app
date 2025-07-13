"use client";
import React from 'react';
import { Card } from "react-bootstrap";
import StackedBarChart from './stacked-bar-chart';

interface StackedBarCardProps {
  title?: string;
  data: { [key: string]: string | number }[];
  keys: string[];
  indexBy: string;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const StackedBarCard: React.FC<StackedBarCardProps> = ({
  title,
  data,
  keys,
  indexBy,
  tickLabelFormat = 'initials',
  xAxisLabel,
  yAxisLabel
}) => {
  return (
    <Card className="h-100">
      <Card.Body>
        {title && <Card.Title>{title}</Card.Title>}
        <StackedBarChart
          data={data}
          keys={keys}
          indexBy={indexBy}
          tickLabelFormat={tickLabelFormat}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
        />
      </Card.Body>
    </Card>
  );
};

export default StackedBarCard;