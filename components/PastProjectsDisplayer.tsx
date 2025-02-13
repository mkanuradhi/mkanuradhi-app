"use client";
import React from 'react';
import { Accordion, Stack } from 'react-bootstrap';

interface PastProject {
  studentName: string;
  degree: string;
  topic: string;
  year: string;
  supervisorsTitle: string;
  supervisors: string[];
  abstractTitle: string;
  abstracts: string[];
}

interface PastProjectsDisplayerProps {
  pastProjects: PastProject[]
}

const PastProjectsDisplayer: React.FC<PastProjectsDisplayerProps> = ({ pastProjects }) => {
  return (
    <>
      <Accordion alwaysOpen>
        {pastProjects.map((project, index) => (
          <Accordion.Item key={index} eventKey={`${index}`}>
            <Accordion.Header>
              {index + 1 + '. '} {project.studentName} - {project.topic}
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <p><em>{project.degree} {project.year && `(${project.year})`}</em></p>
              </div>
              <div>
                <h5>{project.supervisorsTitle}</h5>
                {project.supervisors && (
                  <Stack direction="horizontal" gap={0} className="flex-wrap">
                    {project.supervisors.map((supervisor, sIndex) => (
                      <div key={sIndex} className="d-flex align-items-center">
                        <div>{supervisor}</div>
                        {sIndex < project.supervisors.length - 1 && (
                          <div className="px-4">|</div>
                        )}
                      </div>
                    ))}
                  </Stack>
                )}
              </div>
              <div className="mt-2">
                <h5>{project.abstractTitle}</h5>
                {project.abstracts.map((para, pIndex) => (
                  <p key={pIndex}>{para}</p>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  )
}

export default PastProjectsDisplayer;