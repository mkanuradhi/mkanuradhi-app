import React from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import PublicationsViewer from '@/components/publications-viewer';

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

  const countArticles = articles.length;
  const countChapters = chapters.length;
  const countProceedings = proceedings.length;
  const countAll = countArticles + countChapters + countProceedings;

  return (
    <>
      <div className="publications">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1>{t('title')}</h1>
            </Col>
          </Row>
          <PublicationsViewer />
        </Container>
      </div>
    </>
  )
}

export default PublicationsPage;