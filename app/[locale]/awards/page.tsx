import React from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';

const baseTPath = 'pages.Awards';

interface AwardDetail {
  year: string;
  descriptions: string[];
}

interface AwardMessages {
  pages: {
    Awards: {
      awardDetails: AwardDetail[];
    };
  };
}

interface GrantDetail {
  year: string;
  description: string;
}

interface GrantMessages {
  pages: {
    Awards: {
      grantDetails: GrantDetail[];
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
        {
          url: '/images/mkanuradhis.png',
          width: 600,
          height: 314,
          alt: 'MKA',
        },
      ],
    }
  };
};

const AwardsPage = () => {
  const t = useTranslations(baseTPath);

  const awardMessages = useMessages() as unknown as AwardMessages | undefined;
  const awardDetails = awardMessages?.pages?.Awards?.awardDetails as AwardDetail[];

  const grantMessages = useMessages() as unknown as GrantMessages | undefined;
  const grantDetails = grantMessages?.pages?.Awards?.grantDetails as GrantDetail[];


  return (
    <>
      <div className="awards">
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
                  {awardDetails.map((detail, index) => (
                    <Row key={index} className="my-4">
                      <Col xs={2} sm={1}><strong>{detail.year}</strong></Col>
                      <Col>
                        {detail.descriptions.map((desc, index) => (
                          <p key={index}>{desc}</p>
                        ))}
                      </Col>
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
                  {grantDetails.map((grant, index) => (
                    <Row key={index} className="my-4">
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

export default AwardsPage;