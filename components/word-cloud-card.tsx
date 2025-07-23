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
}

const WordCloudCard: React.FC<WordCloudCardProps> = ({
  title,
  data,
  hrefBase,
  newTab,
}) => {
  return (
    <Card>
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
        <WordCloudChart data={data} hrefBase={hrefBase} newTab={newTab} />
      </Card.Body>
    </Card>
  );
};

export default WordCloudCard;