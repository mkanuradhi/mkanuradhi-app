"use client";
import Research from "@/interfaces/i-research";
import { useTranslations } from "next-intl";
import { Accordion, Badge, Stack } from "react-bootstrap";
import SanitizedHtml from "./sanitized-html";
import ResearchSupervisors from "./research-supervisors";
import { Link } from "@/i18n/routing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFilePowerpoint } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const baseTPath = 'components.ThesesViewer';

interface ThesisViewerProps {
  theses: Research[];
}

const ThesesViewer: React.FC<ThesisViewerProps> = ({ theses }) => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <Accordion alwaysOpen>
        {theses.map((thesis, index) => (
          <Accordion.Item key={index} eventKey={`${index}`}>
            <Accordion.Header>
              {thesis.type} - {thesis.title}
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <p>
                  <em>{thesis.location} {thesis.completedYear && `(${thesis.completedYear})`}</em>
                </p>
              </div>
              <div className="my-3">
                <h5>{t('abstract')}</h5>
                <SanitizedHtml html={thesis.abstract} className="ql-content" />
              </div>
              {thesis.supervisors && thesis.supervisors.length > 0 && (
                <div className="my-3">
                  <h6>{t('supervisors')}</h6>
                  <ResearchSupervisors supervisors={thesis.supervisors} />
                </div>
              )}
              {thesis.keywords && thesis.keywords.length > 0 && (
                <div className="my-3">
                  <h6>{t('keywords')}</h6>
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    {thesis.keywords.map((keyword, kIndex) => (
                      <Badge pill key={kIndex}>{keyword}</Badge>
                    ))}
                  </Stack>
                </div>
              )}
              { (thesis.thesisUrl || thesis.githubUrl || thesis.slidesUrl) && (
                <div className="d-flex flex-wrap gap-4 align-items-center my-4">
                  {thesis.thesisUrl && (
                    <Link
                      href={thesis.thesisUrl}
                      className="d-inline-flex align-items-center text-decoration-none"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-success d-inline-flex align-items-center gap-1">
                        <FontAwesomeIcon icon={faFile} />
                        <span>{t('thesis')}</span>
                      </span>
                    </Link>
                  )}
                  {thesis.githubUrl && (
                    <Link
                      href={thesis.githubUrl}
                      className="d-inline-flex align-items-center text-decoration-none"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-body d-inline-flex align-items-center gap-1">
                        <FontAwesomeIcon icon={faGithub} />
                        <span>{t('github')}</span>
                      </span>
                    </Link>
                  )}
                  {thesis.slidesUrl && (
                    <Link
                      href={thesis.slidesUrl}
                      className="d-inline-flex align-items-center text-decoration-none"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-warning d-inline-flex align-items-center gap-1">
                        <FontAwesomeIcon icon={faFilePowerpoint} />
                        <span>{t('slides')}</span>
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}

export default ThesesViewer;