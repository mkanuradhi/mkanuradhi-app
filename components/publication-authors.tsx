import React from "react";
import { useTranslations } from "next-intl";
import { PublicationAuthor } from "@/interfaces/i-publication";
import "./publication-authors.scss";


const baseTPath = 'components.PublicationAuthors';

interface Props {
  authors: PublicationAuthor[];
}

const PublicationAuthors: React.FC<Props> = ({ authors }) => {
  const t = useTranslations(baseTPath);

  // Map unique affiliations to superscript numbers
  const affiliationsMap = new Map<string, number>();
  let affiliationIndex = 1;
  authors.forEach(author => {
    if (author.affiliation && !affiliationsMap.has(author.affiliation)) {
      affiliationsMap.set(author.affiliation, affiliationIndex++);
    }
  });

  return (
    <>
      <div className="publication-authors mb-1">
        {/* Authors with superscripted affiliations and links */}
        <div className="mb-2">
          {authors.map((author, index) => {
            const affNumber = author.affiliation ? affiliationsMap.get(author.affiliation) : null;
            return (
              <span key={index} className="me-1">
                <span className={author.isMe ? 'fw-bold' : ''}>
                  {author.profileUrl ? (
                    <a
                      href={author.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="author-link"
                    >
                      {author.name}
                    </a>
                  ) : (
                    <span>{author.name}</span>
                  )}
                </span>
                {affNumber && (
                  <sup className="text-muted ms-1">{affNumber}</sup>
                )}
                {author.corresponding && (
                  <sup className="text-muted ms-1" title={t('correspondingAuthor')}>
                    <i className="bi bi-asterisk" style={{ fontSize: '0.65rem' }}></i>
                  </sup>
                )}
                {index < authors.length - 1 && <span className="me-2">,</span>}
              </span>
            );
          })}
        </div>
        {/* Affiliation legend */}
        {affiliationsMap.size > 0 && (
          <div className="small text-muted mb-3">
            {Array.from(affiliationsMap.entries()).map(([aff, i]) => (
              <div key={i}>
                <sup>{i}</sup> {aff}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PublicationAuthors;