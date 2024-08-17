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
  const details = t('details', { returnObjects: true }) as AwardDetail[];

  return (
    <>
      <MetaTags
        title={t('title')}
        subTitle={t('subTitle')}
        description={t('description')} 
        image={anuImage} 
      />
      <div className="publications">
        <Container>
          <Row className="top-margin-row">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                <p>{t('description')}</p>
              </section>
              <section>
                <dl>
                  {details.map(detail => (
                    <>
                      <dt key={uuidv4()}>{detail.year}</dt>
                      <dd>{detail.description}</dd>
                    </>
                  ))}
                </dl>
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
