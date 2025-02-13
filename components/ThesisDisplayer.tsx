"use client";
import React from 'react';
import { Accordion, Badge, Stack } from 'react-bootstrap';

interface ThesisDetail {
  degree: string;
  topic: string;
  university: string;
  year: string;
  keywordsTitle?: string;
  keywords?: string[];
  abstractTitle: string;
  abstracts: string[];
}

interface ThesisDisplayerProps {
  thesisDetails: ThesisDetail[]
}

const ThesisDisplayer: React.FC<ThesisDisplayerProps> = ({ thesisDetails }) => {
  return (
    <>
      <Accordion alwaysOpen>
        {thesisDetails.map((thesis, index) => (
          <Accordion.Item key={index} eventKey={`${index}`}>
            <Accordion.Header>
              {thesis.degree} - {thesis.topic}
            </Accordion.Header>
            <Accordion.Body>
              <div>
                <p><em>{thesis.university} {thesis.year && `(${thesis.year})`}</em></p>
              </div>
              <div>
                <h5>{thesis.abstractTitle}</h5>
                {thesis.abstracts.map((para, pIndex) => (
                  <p key={pIndex}>{para}</p>
                ))}
              </div>
              <div>
                <h6>{thesis.keywordsTitle}</h6>
                {thesis.keywords && (
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    {thesis.keywords.map((keyword, kIndex) => (
                      <Badge pill key={kIndex}>{keyword}</Badge>
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

export default ThesisDisplayer;