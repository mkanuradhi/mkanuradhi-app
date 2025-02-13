"use client";
import React from 'react';
import { Accordion, Stack } from 'react-bootstrap';

interface CurrentProject {
  studentName: string;
  degree: string;
  topic: string;
  year: string;
  supervisorsTitle: string;
  supervisors: string[];
}

interface CurrentProjectsDisplayerProps {
  currentProjects: CurrentProject[]
}

const CurrentProjectsDisplayer: React.FC<CurrentProjectsDisplayerProps> = ({ currentProjects }) => {
  return (
    <>
      <Accordion alwaysOpen>
        {currentProjects.map((project, index) => (
          <Accordion.Item key={index} eventKey={`${index}`}>
            <Accordion.Header>
              {project.studentName} - {project.topic}
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <p><em>{project.degree} {project.year && `(${project.year})`}</em></p>
              </div>
              <div>
                <h5>{project.supervisorsTitle}</h5>
                {project.supervisors && (
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    {project.supervisors.map((supervisor, sIndex) => (
                      <div key={sIndex}>{supervisor}</div>
                    ))}
                  </Stack>
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  )
}

export default CurrentProjectsDisplayer;