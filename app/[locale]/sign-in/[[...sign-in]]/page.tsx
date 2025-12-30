import { SignIn } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';

const baseTPath = 'clerk.signIn';
export const revalidate = 3600; // cache for 1 hour

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('start.title'),
    description: t('start.title'),
    keywords: ["sign in", "login"],
    openGraph: {
      title: t('start.title'),
      description: t('start.title'),
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
  }
};

const SignInPage = async () => {
  return (
    <>
      <Container>
        <Row className="d-flex justify-content-center align-items-center my-4">
          <Col className="d-flex justify-content-center">
            <SignIn />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SignInPage;