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
  integerOnlyYTicks?: boolean;
  legendAnchor?: 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left' | 'center';
  heightPropotion?: number;
}

const StackedBarCard: React.FC<StackedBarCardProps> = ({
  title,
  data,
  keys,
  indexBy,
  tickLabelFormat = 'initials',
  xAxisLabel,
  yAxisLabel,
  integerOnlyYTicks,
  legendAnchor = 'top-left',
  heightPropotion,
}) => {
  return (
    <Card>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        <StackedBarChart
          data={data}
          keys={keys}
          indexBy={indexBy}
          tickLabelFormat={tickLabelFormat}
          xAxisLabel={xAxisLabel}
          yAxisLabel={yAxisLabel}
          integerOnlyYTicks={integerOnlyYTicks}
          legendAnchor={legendAnchor}
          heightPropotion={heightPropotion}
        />
      </Card.Body>
    </Card>
  );
};

export default StackedBarCard;