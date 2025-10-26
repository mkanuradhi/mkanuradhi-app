'use client';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import PublicationCard from './publication-card';
import LoadingContainer from './loading-container';
import { useTranslations } from 'next-intl';
import Publication from '@/interfaces/i-publication';
import ScrollReveal from './scroll-reveal';

const baseTPath = 'components.PublicationsList';

interface PublicationsListProps {
  publications: Publication[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

const PublicationsList: React.FC<PublicationsListProps> = ({ publications, isLoading, isFetching, isError }) => {
  const t = useTranslations(baseTPath);

  if (isLoading || isFetching) {
    return (<LoadingContainer />);
  }

  if (isError || !publications) {
    return (
      <Row>
        <Col>
          <p className="text-muted small mb-1">{t('fail')}</p>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Row>
        {publications.map((pub) => (
          <ScrollReveal key={pub.id} className="col-md-12 mb-2">
            <PublicationCard publication={pub} />
          </ScrollReveal>
        ))}
      </Row>
    </>
  );
};

export default PublicationsList;