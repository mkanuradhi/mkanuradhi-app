"use client";
import React from 'react';
import { Card } from "react-bootstrap";
import BarChart from './bar-chart';

interface BarCardProps {
  title?: string;
  data: { [key: string]: string | number }[];
}

const BarCard: React.FC<BarCardProps> = ({ title, data }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        {title && <Card.Title>{title}</Card.Title>}
        <BarChart
          data={data}
          keys={['count']}
          indexBy="year"
          tickLabelFormat='initials'
        />
      </Card.Body>
    </Card>
  );
};

export default BarCard;