"use client";
import React from 'react';
import { Card } from "react-bootstrap";
import PieChart from './pie-chart';

interface PieCardProps {
  title?: string;
  data: { id: string; value: number; label?: string; color?: string }[];
  innerRadius?: number;
  tickLabelFormat?: 'truncate' | 'initials' | 'full';
  heightPropotion?: number;
}

const PieCard: React.FC<PieCardProps> = ({
  title,
  data,
  innerRadius,
  tickLabelFormat = 'truncate',
  heightPropotion,
}) => {
  return (
    <Card>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        <PieChart
          data={data}
          innerRadius={innerRadius}
          tickLabelFormat={tickLabelFormat}
          heightPropotion={heightPropotion}
        />
      </Card.Body>
    </Card>
  );
};

export default PieCard;