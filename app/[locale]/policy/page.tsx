import React from 'react';
import { getMessages, getTranslations } from 'next-intl/server';
import { Alert, Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faEnvelope, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { generateLocaleParams } from '@/utils/static-params';
import "./page.scss";

const baseTPath = 'pages.Policy';

export const dynamicParams = true;
export const revalidate = 604800; // cache for 1 week

// export async function generateStaticParams() {
//   return [
//     { locale: 'en' },
//     { locale: 'si' }
//   ];
// }

export const generateStaticParams = generateLocaleParams;

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

const PrivacyPage =  async ({ params }: { params: { locale: string } }) => {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });
  const messages = await getMessages({ locale }) as any;

  const getArrayFromMessages = (key: string): string[] => {
    return messages?.pages?.Policy?.[key] || [];
  };

  return (
    <>
      <div className="privacy">
        <Container fluid="md" className="py-5">
          <Row>
            <Col>
              <h1 className='mb-4'>{t('title')}</h1>

              {/* dates section */}
              <Card className='mb-4 dates-card'>
                <CardBody>
                  <Row>
                    <Col xs="6">
                      <FontAwesomeIcon icon={faCalendarAlt} className='me-2' />
                      <span><strong className='me-2'>{t('effectiveLabel')}</strong> {t('effectiveDate')}</span>
                    </Col>
                    <Col xs="6" className='text-md-end'>
                      <FontAwesomeIcon icon={faSyncAlt} className='me-2' />
                      <span><strong className='me-2'>{t('updatedLabel')}</strong> {t('updatedDate')}</span>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* introduction */}
              <div className='mb-4'>
                <p className="mb-2">
                  {t.rich('introPara1', {
                    bold: (chunks) => <strong>{chunks}</strong>
                  })}
                </p>
                <p className="mb-2">
                  {t('introPara2')}
                </p>
              </div>

              <hr className='my-4' />

              {/* section 1 - information collection */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">1</span>
                  {t('infoCollectionTitle')}
                </h2>

                {/* 1.1 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">1.1</span>{t('infoCollectionSubTitle1')}
                </h3>
                <p>{t('infoCollectionSubPara1')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('infoCollectionSubList1').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>

                {/* 1.2 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">1.2</span>{t('infoCollectionSubTitle2')}
                </h3>
                <p>{t('infoCollectionSubPara2')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('infoCollectionSubList2').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>

                {/* 1.3 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">1.3</span>{t('infoCollectionSubTitle3')}
                </h3>
                <p>{t('infoCollectionSubPara3')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('infoCollectionSubList3').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>
                <p>{t('infoCollectionSubPara32')}</p>
              </section>

              <hr className='my-4' />

              {/* Section 2 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">2</span>
                  {t('infoUsedTitle')}
                </h2>

                {/* 2.1 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">2.1</span>{t('infoUsedSubTitle1')}
                </h3>
                <p>{t('infoUsedSubPara1')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('infoUsedSubList1').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>

                {/* 2.2 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">2.2</span>{t('infoUsedSubTitle2')}
                </h3>
                <p>{t('infoUsedSubPara2')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('infoUsedSubList2').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>

                {/* 2.3 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">2.3</span>{t('infoUsedSubTitle3')}
                </h3>
                <p>{t('infoUsedSubPara3')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('infoUsedSubList3').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>
              </section>

              <hr className='my-4' />

              {/* Section 3 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">3</span>
                  {t('dataStorageTitle')}
                </h2>

                {/* 3.1 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">3.1</span>{t('dataStorageSubTitle1')}
                </h3>
                <p>{t('dataStorageSubPara1')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('dataStorageSubList1').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>

                {/* 3.2 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">3.2</span>{t('dataStorageSubTitle2')}
                </h3>
                <ul className="mb-4">
                  {getArrayFromMessages('dataStorageSubList2').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>

                {/* 3.3 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">3.3</span>{t('dataStorageSubTitle3')}
                </h3>
                <Alert variant="warning">{t('dataStorageSubPara3')}</Alert>
              </section>

              <hr className='my-4' />

              {/* Section 4 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">4</span>
                  {t('dataSharingTitle')}
                </h2>

                {/* 4.1 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">4.1</span>{t('dataSharingSubTitle1')}
                </h3>
                <p>{t('dataSharingSubPara1')}</p>

                {/* 4.2 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">4.2</span>{t('dataSharingSubTitle2')}
                </h3>
                <p>{t('dataSharingSubPara2')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('dataSharingSubList2').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>
                <p>{t('dataSharingSubPara22')}</p>

                {/* 4.3 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">4.3</span>{t('dataSharingSubTitle3')}
                </h3>
                <p>{t('dataSharingSubPara3')}</p>
              </section>

              <hr className='my-4' />

              {/* Section 5 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">5</span>
                  {t('yourRightsTitle')}
                </h2>

                {/* 5.1 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">5.1</span>{t('yourRightsSubTitle1')}
                </h3>
                <p>{t('yourRightsSubPara1')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('yourRightsSubList1').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>

                {/* 5.2 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">5.2</span>{t('yourRightsSubTitle2')}
                </h3>
                <p>{t('yourRightsSubPara2')}</p>

                {/* 5.3 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">5.3</span>{t('yourRightsSubTitle3')}
                </h3>
                <p>{t('yourRightsSubPara3')}</p>

                {/* 5.4 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">5.4</span>{t('yourRightsSubTitle4')}
                </h3>
                <p>{t('yourRightsSubPara4')}</p>

                {/* 5.5 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">5.5</span>{t('yourRightsSubTitle5')}
                </h3>
                <Alert variant="primary">
                  <p>{t('yourRightsSubPara5')}</p>
                  <span>{t('yourRightsSubPara52')}</span>
                </Alert>
              </section>

              <hr className='my-4' />

              {/* Section 6 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">6</span>
                  {t('internationalDataTitle')}
                </h2>

                <p>{t('internationalDataSubPara')}</p>
              </section>

              <hr className='my-4' />

              {/* Section 7 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">7</span>
                  {t('childPrivacyTitle')}
                </h2>

                <p>{t('childPrivacySubPara1')}</p>
                <p>{t('childPrivacySubPara2')}</p>
              </section>

              <hr className='my-4' />

              {/* Section 8 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">8</span>
                  {t('linksThirdTitle')}
                </h2>

                <p>{t('linksThirdSubPara')}</p>
              </section>

              <hr className='my-4' />

              {/* Section 9 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">9</span>
                  {t('changesPolicyTitle')}
                </h2>

                {/* 9.1 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">9.1</span>{t('changesPolicySubTitle1')}
                </h3>
                <p>{t('changesPolicySubPara1')}</p>

                {/* 9.2 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">9.2</span>{t('changesPolicySubTitle2')}
                </h3>
                <p>{t('changesPolicySubPara2')}</p>
                <ul className="mb-4">
                  {getArrayFromMessages('changesPolicySubList2').map((item, id) => (
                    <li key={id} className="mb-2">
                      {t.rich(item, {
                        bold: (chunks) => <strong>{chunks}</strong>
                      })}
                    </li>
                  ))}
                </ul>

                {/* 9.3 */}
                <h3 className="h5 fw-semibold mt-4 mb-3">
                    <span className="subsection-number">9.3</span>{t('changesPolicySubTitle3')}
                </h3>
                <p>{t('changesPolicySubPara3')}</p>

              </section>

              <hr className='my-4' />

              {/* Section 10 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">10</span>
                  {t('langInterpretTitle')}
                </h2>

                <p>{t.rich('langInterpretSubPara', {
                  bold: (chunks) => <strong>{chunks}</strong>
                })}</p>
              </section>

              <hr className='my-4' />

              {/* Section 11 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">11</span>
                  {t('governLawTitle')}
                </h2>

                <p>{t('governLawSubPara')}</p>
              </section>

              <hr className='my-4' />

              {/* Section 12 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">12</span>
                  {t('contactInfoTitle')}
                </h2>

                <p>{t('contactInfoPara')}</p>

                <Alert variant='light' className="text-center">
                  <h3 className="h5 fw-semibold mt-4 mb-3">
                    <FontAwesomeIcon icon={faEnvelope} className='me-2' />
                    {t('contactInfoSubTitle1')}
                  </h3>
                  <p className='text-center'>{t.rich('contactInfoSubPara1', {
                    bold: (chunks) => <strong>{chunks}</strong>
                  })}</p>
                  <p className='text-center'>{t.rich('contactInfoSubPara2', {
                    bold: (chunks) => <strong>{chunks}</strong>
                  })}</p>
                  <p className='text-center'>{t('contactInfoSubPara3')}</p>
                </Alert>
              </section>

              <hr className='my-4' />

              {/* Section 13 */}
              <section>
                <h2 className="h3 fw-bold mb-4 d-flex align-items-center">
                  <span className="badge bg-primary rounded-pill me-3 section-badge">13</span>
                  {t('acknowledgmentTitle')}
                </h2>

                <Alert variant='info'>
                  {t.rich('acknowledgmentPara', {
                    bold: (chunks) => <strong>{chunks}</strong>
                  })}
                </Alert>
              </section>

            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}

export default PrivacyPage;