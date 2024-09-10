import { useMessages, useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Col, Container, Row } from 'react-bootstrap';
import { faGoogleScholar, faLinkedin, faOrcid, faResearchgate } from '@fortawesome/free-brands-svg-icons';
import ScopusIcon from '@/app/icons/ScopusIcon';
import anuImage from "@/public/images/anuradha.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faBookmark } from '@fortawesome/free-solid-svg-icons';
import ExternalLinkBar from '@/app/components/ExternalLinkBar';
import Image from 'next/image';
import './home.scss';

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

  return {
    title: {
      absolute: t('pageTitle')
    },
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
      tooltipText: 'Google Scholar',
      url: 'https://scholar.google.com/citations?hl=en&user=-O25soMAAAAJ',
      faIcon: faGoogleScholar,
    },
    {
      tooltipText: 'LinkedIn',
      url: 'https://www.linkedin.com/in/anuradha-ariyaratne-3a406281/',
      faIcon: faLinkedin,
    },
    {
      tooltipText: 'ORCID',
      url: 'https://orcid.org/0000-0002-3548-3976',
      faIcon: faOrcid,
    },
    {
      tooltipText: 'ResearchGate',
      url: 'https://www.researchgate.net/profile/Anuradha-Ariyaratne',
      faIcon: faResearchgate,
    },
    {
      tooltipText: 'Scopus',
      url: 'https://www.scopus.com/authid/detail.uri?authorId=57188855115',
      customIcon: <ScopusIcon size={30} />,
    },
  ];

  return (
    <>
      <div className="home">
        <Container fluid="md">
          <Row className="my-4">
            <Col sm={5}>
              <Image src={anuImage} alt={t('title')} priority quality={100} className="main-image" />
              <div className="text-center">
                <h1>{t('title')}</h1>
                <h5>{t('subTitle')}</h5>
                <h6><a href="https://www.sjp.ac.lk/" target="_blank" rel="noopener noreferrer">{t('university')}</a></h6>
              </div>
              <ExternalLinkBar links={externalLinks} />
            </Col>
            <Col sm={7}>
              <div>
                <h1 className="text-center">{t('aboutTitle')}</h1>
                {descriptions.map((desc, index) => (
                  <p key={index} className="text-justify">
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
        </Container>
      </div>
    </>
  );
}