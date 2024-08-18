import { useTranslation } from "react-i18next";
import MetaTags from "../components/MetaTags";
import anuImage from "../assets/images/anuradha.png";
import { Accordion, Badge, Col, Container, Row, Stack } from "react-bootstrap";

interface ThesisDetail extends AbstractDetails {
  degree: string;
  topic: string;
  university: string;
  year: string;
  keywordsTitle?: string;
  keywords?: string[];
}

interface CurrentProject {
  studentName: string;
  degree: string;
  topic: string;
  year: string;
  supervisorsTitle: string;
  supervisors: string[];
}

interface PastProject extends CurrentProject, AbstractDetails {
}

interface AbstractDetails {
  abstractTitle: string;
  abstracts: string[];
}

export const Research = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Research' });
  const thesisDetails = t('thesisDetails', { returnObjects: true }) as ThesisDetail[];
  const currentUnderGradProjects = t('currentUnderGradProjects', { returnObjects: true }) as CurrentProject[];
  const currentPostGradProjects = t('currentPostGradProjects', { returnObjects: true }) as CurrentProject[];
  const pastUnderGradProjects = t('pastUnderGradProjects', { returnObjects: true }) as PastProject[];
  const pastPostGradProjects = t('pastPostGradProjects', { returnObjects: true }) as PastProject[];

  return (
    <>
      <MetaTags
        title={t('title')}
        subTitle={t('subTitle')}
        description={t('description')} 
        image={anuImage} 
      />
      <div className="research">
        <Container>
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                <p>{t('description')}</p>
              </section>
              <section className="mt-4 mb-2">
                <h3>{t('thesisTitle')}</h3>
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
              </section>
              {currentUnderGradProjects.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('currentUnderGradTitle')}</h3>
                  <Accordion alwaysOpen>
                    {currentUnderGradProjects.map((project, index) => (
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
                </section>
              )}
              {currentPostGradProjects.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('currentPostGradTitle')}</h3>
                  <Accordion alwaysOpen>
                    {currentPostGradProjects.map((project, index) => (
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
                </section>
              )}
              {pastUnderGradProjects.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('pastUnderGradTitle')}</h3>
                  <Accordion alwaysOpen>
                    {pastUnderGradProjects.map((project, index) => (
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
                </section>
              )}
              {pastPostGradProjects.length > 0 && (
                <section className="mt-4 mb-2">
                  <h3>{t('pastPostGradTitle')}</h3>
                  <Accordion alwaysOpen>
                    {pastPostGradProjects.map((project, index) => (
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
                </section>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
