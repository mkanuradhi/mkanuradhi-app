"use client";
import React, { useState } from 'react';
import { Badge, Card, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faFilePdf, faFlask, faLink, faMicrophone, faNewspaper, faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import Publication from '@/interfaces/i-publication';
import PublicationType from '@/enums/publication-type';
import PublicationStatus from '@/enums/publication-status';
import { useTranslations } from "next-intl";
import GlowLink from './GlowLink';
import PublicationAuthors from './publication-authors';
import { Link } from '@/i18n/routing';
import { AnimatePresence, motion } from "framer-motion";

const baseTPath = 'components.PublicationCard';

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const t = useTranslations(baseTPath);
  const [expanded, setExpanded] = useState<'abstract' | 'bibtex' | null>(null);

  const toggleSection = (section: 'abstract' | 'bibtex') => {
    setExpanded(prev => (prev === section ? null : section));
  };

  const renderTypeOrStatus = () => {
    if (publication.publicationStatus === PublicationStatus.PREPRINT) {
      return (
        <>
          <span className="me-2 text-muted fst-italic small">{t(publication.publicationStatus.toLowerCase())}</span>
          <FontAwesomeIcon icon={faFlask} className="text-info" />
        </>
      );
    }

    const typeLabel = t(publication.type.toLowerCase());
    const icon = {
      [PublicationType.JOURNAL_ARTICLE]: faNewspaper,
      [PublicationType.BOOK_CHAPTER]: faBook,
      [PublicationType.CONFERENCE_PROCEEDING]: faMicrophone,
    }[publication.type];

    const iconClass = {
      [PublicationType.JOURNAL_ARTICLE]: 'text-primary',
      [PublicationType.BOOK_CHAPTER]: 'text-success',
      [PublicationType.CONFERENCE_PROCEEDING]: 'text-warning',
    }[publication.type];

    return (
      <>
        <span className="me-2">{typeLabel}</span>
        {icon && <FontAwesomeIcon icon={icon} className={iconClass} />}
      </>
    );
  };

  const getTypeIcon = () => {
    switch (publication.type) {
      case PublicationType.JOURNAL_ARTICLE:
        return <FontAwesomeIcon icon={faNewspaper} className="text-primary" />;
      case PublicationType.BOOK_CHAPTER:
        return <FontAwesomeIcon icon={faBook} className="text-success" />;
      case PublicationType.CONFERENCE_PROCEEDING:
        return <FontAwesomeIcon icon={faMicrophone} className="text-warning" />;
      default:
        return null;
    }
  };

  return (
    <Card className="my-3 shadow publication-card">
      <Card.Body>
        <Card.Subtitle className="my-2">
          <Row className="align-items-center">
            <Col>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span>{publication.year}</span>
                {publication.publicationStatus !== PublicationStatus.PUBLISHED &&
                  publication.publicationStatus !== PublicationStatus.PREPRINT && (
                    <span className="text-muted fst-italic small">
                      {t(publication.publicationStatus.toLowerCase())}
                    </span>
                )}
              </div>
            </Col>
            <Col xs="auto">{renderTypeOrStatus()}</Col>
          </Row>
        </Card.Subtitle>

        <Card.Title>
          <GlowLink href={publication.publicationUrl} newTab>
            {publication.title}
          </GlowLink>
        </Card.Title>

        {publication.tags && publication.tags.length > 0 && (
          <div className="mb-2">
            {publication.tags.map((tag, index) => (
              <Badge key={index} pill bg="secondary" className="me-1">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="mb-1">{publication.source}</p>

        <PublicationAuthors authors={publication.authors} />

        <div className="d-flex flex-wrap gap-3 align-items-center mb-3 small">
          {publication.doiUrl && (
            <Link
              href={publication.doiUrl}
              className="d-inline-flex align-items-center gap-1 text-decoration-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-primary d-inline-flex align-items-center gap-1">
                <FontAwesomeIcon icon={faLink} />
                <span>{t('doi')}</span>
              </span>
            </Link>
          )}
          {publication.pdfUrl && (
            <Link
              href={publication.pdfUrl}
              className="d-inline-flex align-items-center gap-1 text-decoration-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-danger d-inline-flex align-items-center gap-1">
                <FontAwesomeIcon icon={faFilePdf} />
                <span>{t('pdf')}</span>
              </span>
            </Link>
          )}
          {publication.preprintUrl && (
            <Link
              href={publication.preprintUrl}
              className="d-inline-flex align-items-center gap-1 text-decoration-none"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-info d-inline-flex align-items-center gap-1">
                <FontAwesomeIcon icon={faFlask} />
                <span>{t('arxiv')}</span>
              </span>
            </Link>
          )}
        </div>

        <div className="mb-2 small">
          {publication.abstract && (
            <span
              role="button"
              onClick={() => toggleSection('abstract')}
              className="me-3 text-primary cursor-pointer"
            >
              {t('abstract')}
            </span>
          )}
          {publication.bibtex && (
            <span
              role="button"
              onClick={() => toggleSection('bibtex')}
              className="text-success cursor-pointer"
            >
              {t('bibtex')}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {expanded === 'abstract' && publication.abstract && (
            <motion.div
              key="abstract"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <pre className="p-3 rounded bg-body-secondary text-body fw-normal lh-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <code>{publication.abstract}</code>
              </pre>
            </motion.div>
          )}

          {expanded === 'bibtex' && publication.bibtex && (
            <motion.div
              key="bibtex"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <pre className="p-3 rounded bg-body-secondary text-body fw-normal lh-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                <code>{publication.bibtex}</code>
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

      </Card.Body>
    </Card>
  );
};

export default PublicationCard;
