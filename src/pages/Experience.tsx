import { useTranslation } from "react-i18next";
import MetaTags from "../components/MetaTags";
import anuImage from "../assets/images/anuradha.png";
import { Col, Container, Row } from "react-bootstrap";

export const Experience = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Experience' });

  return (
    <>
      <MetaTags
        title={t('title')}
        subTitle={t('subTitle')}
        description={t('description')} 
        image={anuImage} 
      />
      <div className="experience">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
              <section>
                <p>{t('description')}</p>
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
