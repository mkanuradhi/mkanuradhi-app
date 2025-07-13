"use client";
import Research from "@/interfaces/i-research";
import { useTranslations } from "next-intl";
import { Accordion, Badge, Stack } from "react-bootstrap";
import SanitizedHtml from "./sanitized-html";
import ResearchSupervisors from "./research-supervisors";
import { Link } from "@/i18n/routing";
import { faFile, faFilePowerpoint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const baseTPath = 'components.ResearchViewer';

interface ResearchViewerProps {
  researches: Research[];
}

const ResearchViewer: React.FC<ResearchViewerProps> = ({ researches }) => {
  const t = useTranslations(baseTPath);

  return (
    <>
      <Accordion alwaysOpen>
        {researches.map((research, index) => (
          <Accordion.Item key={index} eventKey={`${index}`}>
            <Accordion.Header>
              <span className="me-2">{index + 1 + '.'}</span>{t(`degreeType.${research.type}`)} - {research.title}
            </Accordion.Header>
            <Accordion.Body>
              {research.studentName && (
                <div>
                  <p>
                    <span className="me-2">{t('studentName')}</span><strong>{research.studentName}</strong>
                  </p>
                </div>
              )}
              {research.degree && (
                <div>
                  <p>{research.degree}</p>
                </div>
              )}
              <div>
                <p>
                  <em>{research.location} {research.completedYear && `(${research.completedYear})`}</em>
                </p>
              </div>
              {research.abstract && (
                <div className="my-3">
                  <h5>{t('abstract')}</h5>
                  <SanitizedHtml html={research.abstract} className="ql-content" />
                </div>
              )}
              {research.supervisors && research.supervisors.length > 0 && (
                <div className="my-3">
                  <h6>{t('supervisors')}</h6>
                  <ResearchSupervisors supervisors={research.supervisors} />
                </div>
              )}
              {research.keywords && research.keywords.length > 0 && (
                <div className="my-3">
                  <h6>{t('keywords')}</h6>
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    {research.keywords.map((keyword, kIndex) => (
                      <Badge pill key={kIndex}>{keyword}</Badge>
                    ))}
                  </Stack>
                </div>
              )}
              { (research.thesisUrl || research.githubUrl || research.slidesUrl) && (
                <div className="d-flex flex-wrap gap-4 align-items-center my-4">
                  {research.thesisUrl && (
                    <Link
                      href={research.thesisUrl}
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
                  {research.githubUrl && (
                    <Link
                      href={research.githubUrl}
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
                  {research.slidesUrl && (
                    <Link
                      href={research.slidesUrl}
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

export default ResearchViewer;