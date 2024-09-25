import React from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';

const baseTPath = 'pages.Policy';

interface CollectedInformationMessages {
  pages: {
    Policy: {
      subItems1: string[];
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

const PrivacyPage = () => {
  const t = useTranslations(baseTPath);

  const collectedInformationMessages = useMessages() as unknown as CollectedInformationMessages | undefined;
  const collectedInformations = collectedInformationMessages?.pages?.Policy?.subItems1 as string[];


  return (
    <>
      <div className="privacy">
        <Container fluid="md">
          <Row className="my-4">
            <Col>
              <h1 className="mb-4">{t('title')}</h1>
              <h6 className="mb-4">{t('subTitle')}</h6>
              <section>
                <p>{t('description')}</p>
              </section>
              <section>
                <h3>{t('subTitle1')}</h3>
                <p>{t('subPara1')}</p>
                <ul>
                  {collectedInformations.map((ci, id) => (
                    <li key={id}>{ci}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>{t('subTitle2')}</h3>
                <p>{t('subPara2')}</p>
              </section>
              <section>
                <h3>{t('subTitle3')}</h3>
                <p>{t('subPara3')}</p>
              </section>
              <section>
                <h3>{t('subTitle4')}</h3>
                <p>{t('subPara4')}</p>
              </section>
              <section>
                <h3>{t('subTitle5')}</h3>
                <p>{t('subPara5')}</p>
              </section>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default PrivacyPage;