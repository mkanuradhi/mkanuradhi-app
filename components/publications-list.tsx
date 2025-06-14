'use client';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useGroupedPublicationsQuery } from '@/hooks/use-publications';
import PublicationCard from './publication-card';
import LoadingContainer from './loading-container';
import { useTranslations } from 'next-intl';

const baseTPath = 'components.PublicationsList';

interface PublicationsListProps {
  filters: {
    type: string;
    sortBy: string;
    search: string;
  };
}

const PublicationsList: React.FC<PublicationsListProps> = ({ filters }) => {
  const t = useTranslations(baseTPath);
  const { data, isLoading, isError } = useGroupedPublicationsQuery();

  { isLoading && (
    <LoadingContainer />
  )}

  { isError || !data && (
    <Row>
      <Col>{t('fail')}</Col>
    </Row>
  )}

  // Flatten grouped publications
  const allPublications = data ? Object.values(data).flat() : [];

  // Filter by type
  let filtered = filters.type === 'all'
    ? allPublications
    : allPublications.filter(pub => pub.type === filters.type);

  if (filters.search.trim() !== '') {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(pub => {
      const inTitle = pub.title.toLowerCase().includes(searchLower);
      const inSource = pub.source?.toLowerCase().includes(searchLower);
      const inAuthors = pub.authors?.some(author =>
        `${author.name}`.toLowerCase().includes(searchLower)
      );
      const inAffiliations = pub.authors?.some(author =>
        `${author.affiliation}`.toLowerCase().includes(searchLower)
      );
      const inAbstract = pub.abstract?.toLowerCase().includes(searchLower);
      const inBibtex = pub.bibtex?.toLowerCase().includes(searchLower);

      return inTitle || inSource || inAuthors || inAffiliations || inAbstract || inBibtex;
    });
  }

  // Sort
  filtered = filtered.sort((a, b) => {
    const aYear = parseInt(String(a.year), 10);
    const bYear = parseInt(String(b.year), 10);

    if (filters.sortBy === 'year-desc') return bYear - aYear;
    if (filters.sortBy === 'year-asc') return aYear - bYear;
    return 0;
  });

  if (filtered.length === 0) {
    return <p>{t('noMatch')}</p>;
  }

  return (
    <Row>
      {filtered.map((pub) => (
        <Col key={pub.id} md={12} className="mb-2">
          <PublicationCard publication={pub} />
        </Col>
      ))}
    </Row>
  );
};

export default PublicationsList;