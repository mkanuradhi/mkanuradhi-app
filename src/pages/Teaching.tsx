import { Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

interface CourseDetail {
  location: string;
  courses: string[];
}

interface TeachingData {
  year: string;
  descriptions: CourseDetail[];
}

export const Teaching = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Teaching' });
  const descriptions: string[] = t('descriptions', { returnObjects: true });
  // const details: string[] = t('details', { returnObjects: true });
  const details = t('details', { returnObjects: true }) as TeachingData;

  return (
    <>
      <div className="teaching">
        <Container>
          <Row className="top-margin-row">
            <Col>
              <h1 className="display-1">{t('title')}</h1>
              <section>
                {descriptions.map(description => (
                  <p key={uuidv4()} className="lead">{description}</p>
                ))}
              </section>
              <h2 className="display-4">{t('coursesTitle')}</h2>
              {details.map((detail, index) => (
                <section key={index}>
                  <h3 className="display-6">{detail.year}</h3>
                  {detail.descriptions.map((desc, descIndex) => (
                    <div key={descIndex}>
                      <p>{desc.location}</p>
                      <ul>
                        {desc.courses.map((course, courseIndex) => (
                          <li key={courseIndex}>{course}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
