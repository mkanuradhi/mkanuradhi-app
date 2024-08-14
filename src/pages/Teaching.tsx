import { Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import anuImage from "../assets/images/anuradha.png";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet-async";

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
  const details = t('details', { returnObjects: true }) as TeachingData[];
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta property="og:title" content={t('title')} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={anuImage} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:description" content={descriptions[0]} />
        <meta property="og:site_name" content="mkanuradhi.github.io" />
        <meta property="og:locale" content="en_US" />
      </Helmet>
      <div className="teaching">
        <Container>
          <Row className="top-margin-row">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                {descriptions.map(description => (
                  <p key={uuidv4()}>{description}</p>
                ))}
              </section>
              <h2>{t('coursesTitle')}</h2>
              {details.map((detail, index) => (
                <section key={index}>
                  <h3>{detail.year}</h3>
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
