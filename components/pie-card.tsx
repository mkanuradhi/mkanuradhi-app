"use client";
import React from 'react';
import { Card } from "react-bootstrap";
import PieChart from './pie-chart';

interface PieCardProps {
  title?: string;
  data: { id: string; value: number; label?: string; color?: string }[];
  innerRadius?: number;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
}

const PieCard: React.FC<PieCardProps> = ({
  title,
  data,
  innerRadius,
  tickLabelFormat = 'truncate',
}) => {
  return (
    <Card className="h-100">
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        <PieChart
          data={data}
          innerRadius={innerRadius}
          tickLabelFormat={tickLabelFormat}
        />
      </Card.Body>
    </Card>
  );
};

export default PieCard;