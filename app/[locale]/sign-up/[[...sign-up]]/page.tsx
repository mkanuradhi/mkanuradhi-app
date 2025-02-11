import { generatePageKey } from '@/utils/server/generate-page-key';
import { SignUp } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const baseTPath = 'clerk.signUp';

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });

  return {
    title: t('start.title'),
    description: t('start.title'),
    keywords: ["sign up", "register"],
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

const SignUpPage = async ({ searchParams }: { searchParams: { key?: string } }) => {
  const correctKey = await generatePageKey();
  
  if (!searchParams.key || searchParams.key !== String(correctKey)) {
    redirect("/");
  }

  const signInUrl = `/sign-in?key=${correctKey}`;
  
  return (
    <>
      <Container>
        <Row className="d-flex justify-content-center align-items-center my-4">
          <Col className="d-flex justify-content-center">
            <SignUp signInUrl={signInUrl} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SignUpPage;