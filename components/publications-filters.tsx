"use client";
import PublicationType from '@/enums/publication-type';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const baseTPath = 'components.PublicationsFilters';

interface FilterState {
  type: string;
  sortBy: string;
  search: string;
}

interface PublicationsFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
}

const PublicationsFilters: React.FC<PublicationsFiltersProps> = ({ filters, onChange }) => {
  const t = useTranslations(baseTPath);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <Row className="mb-3">
      <Col sm={4} className="mb-1 mb-md-0">
        <Form.Control
          type="search"
          placeholder={t('searchPlaceholder')}
          name="search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </Col>
      <Col sm={4} className="mb-1 mb-md-0">
        <Form.Select name="type" value={filters.type} onChange={handleChange}>
          <option value="all">{t('all')}</option>
          <option value={PublicationType.JOURNAL_ARTICLE}>{t(PublicationType.JOURNAL_ARTICLE.toLowerCase())}</option>
          <option value={PublicationType.BOOK_CHAPTER}>{t(PublicationType.BOOK_CHAPTER.toLowerCase())}</option>
          <option value={PublicationType.CONFERENCE_PROCEEDING}>{t(PublicationType.CONFERENCE_PROCEEDING.toLowerCase())}</option>
        </Form.Select>
      </Col>
      <Col sm={4} className="mb-1 mb-md-0">
        <Form.Select name="sortBy" value={filters.sortBy} onChange={handleChange}>
          <option value="year-desc">{t('year-desc')}</option>
          <option value="year-asc">{t('year-asc')}</option>
        </Form.Select>
      </Col>
    </Row>
  );
};

export default PublicationsFilters;
