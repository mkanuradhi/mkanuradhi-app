import React from 'react';
import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import { faGoogleScholar, faLinkedin, faOrcid, faResearchgate } from '@fortawesome/free-brands-svg-icons';
import ScopusIcon from '@/icons/ScopusIcon';
import WebOfScienceIcon from '@/icons/WebOfScienceIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBookmark } from '@fortawesome/free-solid-svg-icons';
import ExternalLinkBar from '@/components/ExternalLinkBar';
import MainImageDisplayer from '@/components/MainImageDisplayer';
import GlowLink from '@/components/GlowLink';
import ToolsSkillsDisplayer from '@/components/ToolsSkillsDisplayer';
import MovingGradientTitle from '@/components/moving-gradient-title';
import './home.scss';
import { LANG_EN, LANG_SI } from '@/constants/common-vars';

const baseTPath = 'pages.Home';

interface DescriptionMessages {
  pages: {
    Home: {
      aboutDescriptions: string[];
    };
  };
}

interface InterestMessages {
  pages: {
    Home: {
      interests: string[];
    };
  };
}

interface EducationMessages {
  pages: {
    Home: {
      educations: string[];
    };
  };
}

export async function generateMetadata ({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: baseTPath });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#person`, // Unique ID for you across all pages
    name: t('pageTitle'),
    url: baseUrl,
    image: `${baseUrl}/images/anuradha.png`,
    jobTitle: t('subTitle'),
    description: t('description'),
    // Skills
    knowsAbout: [
      'Meta-heuristic optimization',
      'Neural Networks',
      'Swarm Intelligence',
      'Machine Learning',
      'Data Science',
      'Artificial Intelligence',
      'Natural Language Processing',
      'Statistical Analysis',
      'Python Programming',
      'R Programming',
      'Nature Inspired Computing',
      'Nature Inspired Algorithms'
    ],
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
 
export default function HomePage() {
  const t = useTranslations(baseTPath);

  const descriptionMessages = useMessages() as unknown as DescriptionMessages | undefined;
  const descriptions = descriptionMessages?.pages?.Home?.aboutDescriptions as string[];

  const interestMessages = useMessages() as unknown as InterestMessages | undefined;
  const interests = interestMessages?.pages?.Home?.interests as string[];

  const educationMessages = useMessages() as unknown as EducationMessages | undefined;
  const educations = educationMessages?.pages?.Home?.educations as string[];

  const externalLinks = [
    {
      tooltipText: `${t('gsTooltip')}`,
      url: 'https://scholar.google.com/citations?user=-O25soMAAAAJ',
      faIcon: faGoogleScholar,
    },
    {
      tooltipText: `${t('liTooltip')}`,
      url: 'https://www.linkedin.com/in/anuradha-ariyaratne-3a406281/',
      faIcon: faLinkedin,
    },
    {
      tooltipText: `${t('oiTooltip')}`,
      url: 'https://orcid.org/0000-0002-3548-3976',
      faIcon: faOrcid,
    },
    {
      tooltipText: `${t('rgTooltip')}`,
      url: 'https://www.researchgate.net/profile/Anuradha-Ariyaratne',
      faIcon: faResearchgate,
    },
    {
      tooltipText: `${t('scTooltip')}`,
      url: 'https://www.scopus.com/authid/detail.uri?authorId=57188855115',
      customIcon: <ScopusIcon size={30} />,
    },
    {
      tooltipText: `${t('wsTooltip')}`,
      url: 'https://www.webofscience.com/wos/author/record/NRY-6429-2025',
      customIcon: <WebOfScienceIcon size={30} />,
    },
  ];

  return (
    <>
      <div className="home">
        <Container fluid="md">
          <Row className="my-4">
            <Col sm={5}>
              <MainImageDisplayer />
              <div className="text-center">
                <MovingGradientTitle text={t('title')} />
                <p className="h5 text-center">{t('subTitle')}</p>
                <p className="h6 text-center">
                  <GlowLink href="https://www.sjp.ac.lk/" newTab={true}>{t('university')}</GlowLink>
                </p>
              </div>
              <ExternalLinkBar links={externalLinks} />
            </Col>
            <Col sm={7}>
              <div>
                <h2 className="h1 text-center">{t('aboutTitle')}</h2>
                {descriptions.map((desc, index) => (
                  <p key={index}>
                    {desc}
                  </p>
                ))}
              </div>
            </Col>
          </Row>
          <Row className="my-4">
            <Col sm={5}>
              <div>
                <h3>{t('interestTitle')}</h3>
                <ul className="home-ul">
                  {interests.map((interest, index) => (
                    <li key={index}>
                      <FontAwesomeIcon icon={faBookmark} className="list-icon" />{interest}
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
            <Col sm={7}>
              <div>
                <h3>{t('educationTitle')}</h3>
                <ul className="home-ul">
                  {educations.map((education, index) => (
                    <li key={index}>
                      <FontAwesomeIcon icon={faGraduationCap} className="list-icon" />{education}
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          </Row>
          <ToolsSkillsDisplayer />
        </Container>
      </div>
    </>
  );
}