'use client';
import React from 'react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import PublicationsFilters from './publications-filters';
import PublicationsList from './publications-list';

const PublicationsViewer = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    sortBy: 'year-desc',
    search: ''
  });

  return (
    <Row className="my-4">
      <Col>
        <PublicationsFilters filters={filters} onChange={setFilters} />
        <PublicationsList filters={filters} />
      </Col>
    </Row>
  );
};

export default PublicationsViewer;