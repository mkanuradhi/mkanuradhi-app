import { Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next";
import anuImage from "../assets/images/anuradha.png";
import { v4 as uuidv4 } from "uuid";
import MetaTags from "../components/MetaTags";

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

  return (
    <>
      <MetaTags
        title={t('title')}
        subTitle={t('subTitle')}
        description={descriptions[0]} 
        image={anuImage} 
      />
      <div className="teaching">
        <Container>
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                {descriptions.map(description => (
                  <p key={uuidv4()}>{description}</p>
                ))}
              </section>
              <h2>{t('subTitle')}</h2>
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
