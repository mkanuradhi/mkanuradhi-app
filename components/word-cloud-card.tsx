"use client";
import React from 'react';
import { Card } from "react-bootstrap";
import WordCloudChart from './word-cloud-chart';

type Word = { text: string; value: number };

interface WordCloudCardProps {
  title?: string;
  data: Word[];
  hrefBase?: string;
  newTab?: boolean;
  angles?: number[];
}

const WordCloudCard: React.FC<WordCloudCardProps> = ({
  title,
  data,
  hrefBase,
  newTab,
  angles,
}) => {
  return (
    <Card>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        <WordCloudChart data={data} hrefBase={hrefBase} newTab={newTab} angles={angles} />
      </Card.Body>
    </Card>
  );
};

export default React.memo(WordCloudCard, (prev, next) => prev.data === next.data);