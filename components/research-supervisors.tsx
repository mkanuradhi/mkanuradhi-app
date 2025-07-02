import React from "react";
import { useTranslations } from "next-intl";
import { ResearchSupervisor } from "@/interfaces/i-research";
import "./research-supervisors.scss";

const baseTPath = 'components.ResearchSupervisors';

interface Props {
  supervisors: ResearchSupervisor[];
}

const ResearchSupervisors: React.FC<Props> = ({ supervisors }) => {
  const t = useTranslations(baseTPath);

  // Map unique affiliations to superscript numbers
  const affiliationsMap = new Map<string, number>();
  let affiliationIndex = 1;
  supervisors.forEach(supervisor => {
    if (supervisor.affiliation && !affiliationsMap.has(supervisor.affiliation)) {
      affiliationsMap.set(supervisor.affiliation, affiliationIndex++);
    }
  });

  return (
    <>
      <div className="research-supervisors mb-1">
        {/* Supervisors with superscripted affiliations and links */}
        <div className="mb-2">
          {supervisors.map((supervisor, index) => {
            const affNumber = supervisor.affiliation ? affiliationsMap.get(supervisor.affiliation) : null;
            return (
              <span key={index} className="me-1">
                <span className={supervisor.isMe ? 'fw-bold' : ''}>
                  {supervisor.profileUrl ? (
                    <a
                      href={supervisor.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="supervisor-link"
                    >
                      {supervisor.name}
                    </a>
                  ) : (
                    <span>{supervisor.name}</span>
                  )}
                </span>
                {affNumber && (
                  <sup className="text-muted ms-1">{affNumber}</sup>
                )}
                {supervisor.role && (
                  <sub className="text-muted" title={t(`${supervisor.role.toLowerCase()}-title`)}>
                    {t(supervisor.role.toLowerCase())}
                  </sub>
                )}
                {index < supervisors.length - 1 && <span className="me-2">,</span>}
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

export default ResearchSupervisors;