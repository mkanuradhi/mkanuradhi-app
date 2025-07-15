"use client";
import React from 'react';
import { Badge, Card, ListGroup } from "react-bootstrap";
import Publication from '@/interfaces/i-publication';
import PublicationType from '@/enums/publication-type';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faMicrophone, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import GlowLink from './GlowLink';
import { useTranslations } from 'next-intl';

const baseTPath = 'components.RecentPublicationCard';

interface RecentPublicationCardProps {
  title?: string;
  publications: Publication[];
}

const RecentPublicationCard: React.FC<RecentPublicationCardProps> = ({ title, publications }) => {
  const t = useTranslations(baseTPath);
  const getTypeIcon = (type: PublicationType) => {
    switch (type) {
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
    <Card className="h-100">
      <Card.Body>
        {title && <Card.Title className="text-center">{title}</Card.Title>}

        {publications.length === 0 ? (
          <p className="text-center text-muted">{t('noPublications')}</p>
        ) : (
          <div className="d-flex flex-column gap-1">
            {publications.map((pub, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center p-1"
              >
                <div className="d-flex align-items-start gap-2">
                  <span className="me-2" title={t(`publicationType.${pub.type}`)}>{getTypeIcon(pub.type)}</span>
                  {pub.publicationUrl ? (
                    <>
                      <p className="">
                        <GlowLink href={pub.publicationUrl} newTab={true} withArrow={true}>
                          {pub.title}
                        </GlowLink>
                        <Badge pill bg="secondary" className="ms-2">{pub.year}</Badge>
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <span>{pub.title}</span>
                        <Badge pill bg="secondary" className="ms-2">{pub.year}</Badge>
                      </p>
                    </>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecentPublicationCard;