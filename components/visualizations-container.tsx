"use client";
import React from 'react';
import { Container, Row } from 'react-bootstrap';
import ScrollReveal from './scroll-reveal';
import VisualizationCard from './visualization-card';


interface VisualizationsContainerProps {
  visuals: {
    id: number,
    title: string,
    description: string,
    path: string,
    image: string,
  }[]
}

const VisualizationsContainer: React.FC<VisualizationsContainerProps> = ({ visuals }) => {

  return (
    <>
      <Container fluid="xl">
        <Row>
          {visuals.map((visual, index) => (
            <ScrollReveal key={visual.id} className="col-sm-6 col-md-4 col-xxl-3 mb-4" delay={index * 0.1}>
              <VisualizationCard visual={visual} />
            </ScrollReveal>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default VisualizationsContainer;