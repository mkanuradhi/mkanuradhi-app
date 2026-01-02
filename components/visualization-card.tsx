"use client";
import React from 'react';
import { Link } from "@/i18n/routing";
import { Card } from "react-bootstrap";
import { motion } from 'framer-motion';


interface VisualizationCardProps {
  title: string;
  description: string;
  path: string;
  image: string;
}

const VisualizationCard: React.FC<VisualizationCardProps> = ({ title, description, path, image }) => {

  return (
    <motion.div
      className="h-100"
      whileHover={{
        scale: 1.01,
        boxShadow: '0px 12px 30px rgba(var(--bs-body-color-rgb), 0.2)'
      }}
      transition={{
        type: 'spring',
        stiffness: 250,
        damping: 20
      }}
    >
      <Card className="h-100">
        <Card.Body>
          <Card.Title>
            <Link href={path} className="stretched-link text-decoration-none">
              {title}
            </Link>
          </Card.Title>
          <Card.Text>
            {description}
          </Card.Text>
        </Card.Body>
        <Card.Img variant="bottom" src={`/images/visualizations/${image}`} />
      </Card>
    </motion.div>
  );
};

export default VisualizationCard;