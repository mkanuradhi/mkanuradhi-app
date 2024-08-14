import { Col, Container, Row } from "react-bootstrap"
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom"

export const NotFound = () => {
  const langKeyPrefix = 'pages.NotFound';
  const { t } = useTranslation('', { keyPrefix: langKeyPrefix });

  return (
    <>
      <div className="notfound">
        <Container>
          <Row className="top-margin-row">
            <Col>
              <div>
                <h1>{t('title')}</h1>
                <h2>{t('subTitle')}</h2>
                {/* <p>{t('description')}</p> */}
                
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
