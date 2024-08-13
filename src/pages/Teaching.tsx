import { Col, Container, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next";

export const Teaching = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Teaching' });
  const descriptions: string[] = t('descriptions', { returnObjects: true });

  return (
    <>
      <div className="teaching">
        <Container>
          <Row className="top-margin-row">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                {descriptions.map(description => (
                  <p>{description}</p>
                ))}
              </section>
              <section>
                <h3>Bachelor's level</h3>
                <ul>
                  <li>Data Structures and Algorithms (2019-2022)</li>
                  <li>Software Engineering (2020-2023)</li>
                  <li>Swarm Intelligence (2018-2023)</li>
                  <li>Evolutionary Computing (2019-2022)</li>
                  <li>Programming Languages Theory (2020-2022)</li>
                  <li>Evolutionary Computing (2020-2022)</li>
                </ul>
              </section>
              <section>
                <h3>Masters level</h3>
                <ul>
                  <li>Machine Learning</li>
                  <li>Nature Inspired Computing</li>
                  <li>Software Engineering</li>
                </ul>
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
