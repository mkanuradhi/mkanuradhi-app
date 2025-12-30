'use client';
import React, { useMemo } from 'react';
import { useState } from 'react';
import { Card, Col, Row, Tab, Tabs } from 'react-bootstrap';
import PublicationsFilters from './publications-filters';
import PublicationsList from './publications-list';
import { useGroupedPublicationsQuery, usePublicationKeywordFrequenciesQuery, useYearlyPublicationsQuery } from '@/hooks/use-publications';
import { useTranslations } from 'next-intl';
import PublicationType from '@/enums/publication-type';
import WordCloudCard from './word-cloud-card';
import LoadingContainer from './loading-container';
import BarCard from './bar-card';

const baseTPath = 'components.PublicationsViewer';

const PublicationsViewer = () => {
  const t = useTranslations(baseTPath);
  const [filters, setFilters] = useState({
    type: 'all',
    sortBy: 'year-desc',
    search: ''
  });

  const { data, isLoading, isFetching, isError } = useGroupedPublicationsQuery();
  const { data: publicationKeywords, isLoading: isKeywordsLoading, isFetching: isKeywordsFetching, isError: isKeywordsError } = usePublicationKeywordFrequenciesQuery();
  const { data: yearlyPublications, isLoading: isYearlyPubLoading, isFetching: isYearlyPubFetching, isError: isYearlyPubError } = useYearlyPublicationsQuery();

  const translatedPublicationKeywords = useMemo(() => {
    if (!publicationKeywords) return [];
    return publicationKeywords.map(item => ({
      text: item.label,
      value: item.value,
    }));
  }, [publicationKeywords]);

  const countLabel = t('count');
  const yearLabel = t('year');
  const translatedYearlyPublicationsBar = useMemo(() => {
    if (!yearlyPublications) return [];
    return yearlyPublications.map(item => ({
      year: `${item.label}`,
    [countLabel]: item.value,
    }));
  }, [yearlyPublications, countLabel]);

  // Flatten grouped publications
  const allPublications = data ? Object.values(data).flat() : [];

  // Filter by type
  let filteredPublications = filters.type === 'all'
    ? allPublications
    : allPublications.filter(pub => pub.type === filters.type);

  if (filters.search.trim() !== '') {
    const searchLower = filters.search.toLowerCase();
    filteredPublications = filteredPublications.filter(pub => {
      const inYear = String(pub.year).includes(searchLower);
      const inTitle = pub.title.toLowerCase().includes(searchLower);
      const inSource = pub.source?.toLowerCase().includes(searchLower);
      const inAuthors = pub.authors?.some(author =>
        author.name.toLowerCase().includes(searchLower)
      );
      const inAffiliations = pub.authors?.some(author =>
        author.affiliation?.toLowerCase().includes(searchLower)
      );
      const inTags = pub.tags?.some(tag =>
        tag?.toLowerCase().includes(searchLower)
      );
      const inAbstract = pub.abstract?.toLowerCase().includes(searchLower);
      const inBibtex = pub.bibtex?.toLowerCase().includes(searchLower);

      return inYear || inTitle || inSource || inAuthors || inAffiliations || inTags || inAbstract || inBibtex;
    });
  }

  // Sort
  filteredPublications = filteredPublications.sort((a, b) => {
    const aYear = parseInt(String(a.year), 10);
    const bYear = parseInt(String(b.year), 10);

    if (filters.sortBy === 'year-desc') return bYear - aYear;
    if (filters.sortBy === 'year-asc') return aYear - bYear;
    return 0;
  });

  const getSummaryText = () => {
    const total = filteredPublications.length;
    const typeCounts = {
      articles: 0,
      chapters: 0,
      proceedings: 0,
      abstracts: 0,
    };

    for (const pub of filteredPublications) {
      switch (pub.type) {
        case PublicationType.JOURNAL_ARTICLE:
          typeCounts.articles++;
          break;
        case PublicationType.BOOK_CHAPTER:
          typeCounts.chapters++;
          break;
        case PublicationType.CONFERENCE_PROCEEDING:
          typeCounts.proceedings++;
          break;
        case PublicationType.ABSTRACT:
          typeCounts.abstracts++;
          break;
      }
    }

    if (!filteredPublications || filteredPublications.length < 1 || total < 1) {
      return t('noMatch');
    }

    return t('summary', {
      total,
      articles: typeCounts.articles,
      chapters: typeCounts.chapters,
      proceedings: typeCounts.proceedings,
      abstracts: typeCounts.abstracts,
    });
  };

  return (
    <Row className="my-4">
      {/* ---- Layout for Large Screens (md and above) ---- */}
      <Col className="d-none d-md-block">
        <Row className="g-4 align-items-stretch">
          <Col>
            <Card className="p-3 h-100">
              <PublicationsFilters filters={filters} onChange={setFilters} summary={getSummaryText()} />
            </Card>
          </Col>
          <Col md={6}>
            <Tabs defaultActiveKey="keywords" id="tab-charts" className="mb-0">
              <Tab eventKey="keywords" title={t('keywordCloudTabTitle')}>
                {isKeywordsLoading || isKeywordsFetching ? (
                  <LoadingContainer />
                ) : isKeywordsError ? (
                  <p className="text-muted small m-3">
                    {t('keywordsFail')}
                  </p>
                ) : (
                  <WordCloudCard
                    data={translatedPublicationKeywords}
                    angles={[0, -90]}
                    heightPropotion={0.45}
                  />
                )}
              </Tab>
              <Tab eventKey="trend" title={t('trendTabTitle')}>
                {isYearlyPubLoading || isYearlyPubFetching ? (
                  <LoadingContainer />
                ) : isYearlyPubError ? (
                  <p className="text-muted small m-3">
                    {t('yearlyPublicationsFail')}
                  </p>
                ) : (
                  <BarCard
                    data={translatedYearlyPublicationsBar}
                    keys={[countLabel]}
                    indexBy="year"
                    xAxisLabel={yearLabel}
                    yAxisLabel={countLabel}
                    integerOnlyYTicks={false}
                    heightPropotion={0.45}
                  />
                )}
              </Tab>
            </Tabs>
          </Col>
        </Row>
        <PublicationsList publications={filteredPublications} isLoading={isLoading} isFetching={isFetching} isError={isError} />
      </Col>
      {/* ---- Layout for Small Screens (sm and below) ---- */}
      <Col className="d-md-none">
        <Tabs defaultActiveKey="publications" id="tab-mobile" className="mb-3">
          <Tab eventKey="publications" title={t('publicationsTabTitle')}>
            <Row>
              <Col>
                <Card className="p-3">
                  <PublicationsFilters filters={filters} onChange={setFilters} summary={getSummaryText()} />
                </Card>
              </Col>
            </Row>
            <PublicationsList publications={filteredPublications} isLoading={isLoading} isFetching={isFetching} isError={isError} />
          </Tab>
          <Tab eventKey="keywords" title={t('keywordCloudTabTitle')}>
            {isKeywordsLoading || isKeywordsFetching ? (
              <LoadingContainer />
            ) : isKeywordsError ? (
              <p className="text-muted small m-3">
                {t('keywordsFail')}
              </p>
            ) : (
              <WordCloudCard
                data={translatedPublicationKeywords}
                angles={[0, -90]}
              />
            )}
          </Tab>
          <Tab eventKey="trend" title={t('trendTabTitle')}>
            {isYearlyPubLoading || isYearlyPubFetching ? (
              <LoadingContainer />
            ) : isYearlyPubError ? (
              <p className="text-muted small m-3">
                {t('yearlyPublicationsFail')}
              </p>
            ) : (
              <BarCard
                data={translatedYearlyPublicationsBar}
                keys={[countLabel]}
                indexBy="year"
                xAxisLabel={yearLabel}
                yAxisLabel={countLabel}
                integerOnlyYTicks={false}
                heightPropotion={0.45}
              />
            )}
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};

export default PublicationsViewer;