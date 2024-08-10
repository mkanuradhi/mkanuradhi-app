import { Col, Container, Image, Row } from "react-bootstrap"
import { useTranslation } from "react-i18next";
import anuImage from "../assets/images/anuradha.png";
import { v4 as uuidv4 } from "uuid";
import "./Home.scss"

export const Home = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Home' });
  const descriptions: string[] = t('aboutDescriptions', { returnObjects: true });

  return (
    <>
      <div className="home">
        <Container>
          <Row className="main-row">
            <Col sm={5}>
              <div>
                <Image src={anuImage} alt={t('title')} roundedCircle className="main-image" />
              </div>
              <div className="text-center">
                <h1>{t('title')}</h1>
                <h5>{t('subTitle')}</h5>
                <h6><a href="https://www.sjp.ac.lk/" target="_blank" rel="noopener noreferrer">{t('university')}</a></h6>
              </div>
            </Col>
            <Col sm={7}>
              <div>
                <h1 className="text-center">{t('aboutTitle')}</h1>
                {descriptions.map(desc => (
                  <p key={uuidv4()} className="description">
                    {desc}
                  </p>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
