import React from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import parse from 'html-react-parser';

const baseTPath = 'pages.Publications';

interface Publication {
  year: string;
  description: string;
  url?: string;
}

interface Article extends Publication {
  level?: string;
}

interface ArticleMessages {
  pages: {
    Publications: {
      articles: Article[];
    };
  };
}

interface ChapterMessages {
  pages: {
    Publications: {
      chapters: Publication[];
    };
  };
}

interface ProceedingMessages {
  pages: {
    Publications: {
      proceedings: Publication[];
    };
  };
}

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: t('pageKeywords'),
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      type: 'website',
      images: [
        {
          url: '/images/mkanuradhi.png',
          width: 1200,
          height: 630,
          alt: 'MKA',
        },
      ],
    }
  };
};

const PublicationsPage = () => {
  const t = useTranslations(baseTPath);

  const articleMessages = useMessages() as unknown as ArticleMessages | undefined;
  const articles = articleMessages?.pages?.Publications?.articles as Article[];

  const chapterMessages = useMessages() as unknown as ChapterMessages | undefined;
  const chapters = chapterMessages?.pages?.Publications?.chapters as Publication[];

  const proceedingMessages = useMessages() as unknown as ProceedingMessages | undefined;
  const proceedings = proceedingMessages?.pages?.Publications?.proceedings as Publication[];

  return (
    <>
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
                  {articles.map((article, index) => (
                    <Row key={index}>
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
                  {chapters.map((chapter, index) => (
                    <Row key={index}>
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
                  {proceedings.map((proceeding, index) => (
                    <Row key={index}>
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

export default PublicationsPage;