import React from 'react';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBookmark } from '@fortawesome/free-solid-svg-icons';
import ToolsSkillsDisplayer from '@/components/tools-skills-displayer';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';
import HeroSection from '@/components/hero-section';
import IntroSection from '@/components/intro-section';
import ResearchSection from '@/components/research-section';
import EducationSection from '@/components/education-section';
import './home.scss';

const baseTPath = 'pages.Home';
export const revalidate = 3600; // cache for 1 hour

export async function generateMetadata ({ params }: { params: Promise<{locale: string}> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: baseTPath });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const messages = await getMessages() as any;

  const getArrayFromMessages = (key: string): string[] => {
    const keys = messages?.pages?.Home?.[key] || [];
    return keys.map((k: string) => messages?.pages?.Home?.[k] || k);
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#person`, // Unique ID for you across all pages
    name: t('pageTitle'),
    url: baseUrl,
    image: `${baseUrl}/images/anuradha.png`,
    jobTitle: t('subTitle'),
    description: t('pageDescription'),
    // Skills
    knowsAbout: getArrayFromMessages('knowsAboutList'),
    // Social media links
    sameAs: [
      'https://scholar.google.com/citations?user=-O25soMAAAAJ',
      'https://www.linkedin.com/in/anuradha-ariyaratne-3a406281/',
      'https://orcid.org/0000-0002-3548-3976',
      'https://www.researchgate.net/profile/Anuradha-Ariyaratne',
      'https://www.scopus.com/authid/detail.uri?authorId=57188855115',
      'https://www.webofscience.com/wos/author/record/NRY-6429-2025',
      'https://github.com/mkanuradhi'
    ],
    // Education
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: t('university')
    },
    // Current position
    worksFor: {
      '@type': 'Organization',
      name: t('university')
    }
  };

  return {
    title: {
      absolute: t('pageTitle')
    },
    description: t('pageDescription'),
    keywords: t('pageKeywords'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/${LANG_EN}`,
        'si': `${baseUrl}/${LANG_SI}`
      }
    },
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      type: 'profile',
      locale: locale === LANG_EN ? 'en_US' : 'si_LK',
      alternateLocale: locale === LANG_EN ? 'si_LK' : 'en_US',
      url: `${baseUrl}/${locale}`,
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
    },
    other: {
      'script:ld+json': JSON.stringify(personSchema)
    }
  };
};

const HomePage = async ({ params }: { params: Promise<{locale: string}> }) => {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: baseTPath });
  const messages = await getMessages({ locale }) as any;

  const interests = messages?.pages?.Home?.interests as string[];
  const educations = messages?.pages?.Home?.educations as string[];

  return (
    <>
      <div className="home">
        <Container fluid="md">
          <HeroSection />
          <IntroSection />
          <ResearchSection />
          <EducationSection />
          
          
          {/* <ToolsSkillsDisplayer /> */}
        </Container>
      </div>
    </>
  );
}

export default HomePage;