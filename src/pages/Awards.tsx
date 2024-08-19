import { useTranslation } from "react-i18next";
import MetaTags from "../components/MetaTags";
import anuImage from "../assets/images/anuradha.png";
import { Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

interface AwardDetail {
  year: string;
  description: string;
}

export const Awards = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Awards' });
  const awardDetails = t('awardDetails', { returnObjects: true }) as AwardDetail[];
  const grantDetails = t('grantDetails', { returnObjects: true }) as AwardDetail[];

  return (
    <>
      <MetaTags
        title={t('title')}
        subTitle={t('subTitle')}
        description={t('description')} 
        image={anuImage} 
      />
      <div className="publications">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                <p>{t('description')}</p>
              </section>
              <section>
                <Container fluid="md">
                  <Row>
                    <Col>
                      <h2>{t('awardTitle')}</h2>
                    </Col>
                  </Row>
                  {awardDetails.map(detail => (
                    <Row key={uuidv4()} className="my-4">
                      <Col xs={2} sm={1}><strong>{detail.year}</strong></Col>
                      <Col>{detail.description}</Col>
                    </Row>
                  ))}
                </Container>
              </section>
              <section>
                <Container fluid="md">
                  <Row>
                    <Col>
                      <h2>{t('grantTitle')}</h2>
                    </Col>
                  </Row>
                  {grantDetails.map(grant => (
                    <Row key={uuidv4()} className="my-4">
                      <Col xs={2} sm={1}><strong>{grant.year}</strong></Col>
                      <Col>{grant.description}</Col>
                    </Row>
                  ))}
                </Container>
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
