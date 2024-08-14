import { Col, Container, Row } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import anuImage from "../assets/images/anuradha.png";
import MetaTags from "../components/MetaTags";
import "./NotFound.scss";

export const NotFound = () => {
  const langKeyPrefix = 'pages.NotFound';
  const { t } = useTranslation('', { keyPrefix: langKeyPrefix });
  const description = t('description', { exlamation: t('descriptionExclamation') });

  return (
    <>
      <MetaTags
        title={t('title')}
        subTitle={t('subTitle')}
        description={description} 
        image={anuImage} 
      />
      <div className="notfound">
        <Container>
          <Row className="top-margin-row">
            <Col>
              <div className="notfound-content">
                <h1>{t('title')}</h1>
                <h2>{t('subTitle')}</h2>
                <FontAwesomeIcon icon={faTriangleExclamation} size="6x" />
                <p>
                  <Trans
                    i18nKey={`${langKeyPrefix}.description`}
                    components={{
                      strong: <strong />,
                      em: <em />,
                      link: <Link to="/">{t('linkText')}</Link>
                    }}
                    values={{ exlamation: t('descriptionExclamation') }}
                  />
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
