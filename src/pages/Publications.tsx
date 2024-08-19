import { useTranslation } from "react-i18next";
import MetaTags from "../components/MetaTags";
import anuImage from "../assets/images/anuradha.png";
import { Col, Container, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import parse from 'html-react-parser';

interface Publication {
  year: string;
  description: string;
  url?: string;
}

interface Article extends Publication {
  level?: string;
}

export const Publications = () => {
  const langKeyPrefix = 'pages.Publications';
  const { t } = useTranslation('', { keyPrefix: langKeyPrefix });
  const articles = t('articles', { returnObjects: true }) as Article[];
  const chapters = t('chapters', { returnObjects: true }) as Publication[];
  const proceedings = t('proceedings', { returnObjects: true }) as Publication[];

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
                      <h2>{t('articlesTitle')}</h2>
                    </Col>
                  </Row>
                  {articles.map(article => (
                    <Row key={uuidv4()}>
                      <Col xs={2} sm={1}>
                        <strong>{article.year}</strong>
                      </Col>
                      <Col>
                        {article.description && (
                          <p>{parse(article.description)}</p>
                        )}
                        {article.level && (
                          <p>{article.level}</p>
                        )}
                        {article.url && (
                          <p className="text-break">
                            <a href={article.url} target="_blank" rel="noopener noreferrer">{article.url}</a>
                          </p>
                        )}
                      </Col>
                    </Row>
                  ))}
                </Container>
              </section>
              <section>
                <Container fluid="md">
                  <Row>
                    <Col>
                      <h2>{t('chaptersTitle')}</h2>
                    </Col>
                  </Row>
                  {chapters.map(chapter => (
                    <Row key={uuidv4()}>
                      <Col xs={2} sm={1}>
                        <strong>{chapter.year}</strong>
                      </Col>
                      <Col>
                        {chapter.description && (
                          <p>{parse(chapter.description)}</p>
                        )}
                        {chapter.url && (
                          <p className="text-break">
                            <a href={chapter.url} target="_blank" rel="noopener noreferrer">{chapter.url}</a>
                          </p>
                        )}
                      </Col>
                    </Row>
                  ))}
                </Container>
              </section>
              <section>
                <Container fluid="md">
                  <Row>
                    <Col>
                      <h2>{t('conferenceTitle')}</h2>
                    </Col>
                  </Row>
                  {proceedings.map(proceeding => (
                    <Row key={uuidv4()}>
                      <Col xs={2} sm={1}>
                        <strong>{proceeding.year}</strong>
                      </Col>
                      <Col>
                        {proceeding.description && (
                          <p>{parse(proceeding.description)}</p>
                        )}
                        {proceeding.url && (
                          <p className="text-break">
                            <a href={proceeding.url} target="_blank" rel="noopener noreferrer">{proceeding.url}</a>
                          </p>
                        )}
                      </Col>
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
