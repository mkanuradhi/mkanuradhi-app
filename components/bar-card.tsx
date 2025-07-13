"use client";
import React from 'react';
import { Card } from "react-bootstrap";
import BarChart from './bar-chart';

interface BarCardProps {
  title?: string;
  data: { [key: string]: string | number }[];
  keys: string[];
  indexBy: string;
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
  tickLabelFormat = 'initials',
  xAxisLabel,
  yAxisLabel,
  integerOnlyYTicks,
}) => {
  return (
    <Card className="h-100">
      <Card.Body>
        {title && <Card.Title>{title}</Card.Title>}
        <BarChart
          data={data}
          keys={keys}
          indexBy={indexBy}
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