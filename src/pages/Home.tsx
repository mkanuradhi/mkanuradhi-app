import { Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import anuImage from "../assets/images/anuradha.png";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faGoogleScholar, faLinkedin, faOrcid, faResearchgate } from '@fortawesome/free-brands-svg-icons';
import ExternalLinkBar from "../components/ExternalLinkBar";
import ScopusIcon from "../icons/ScopusIcon";
import MetaTags from "../components/MetaTags";
import { motion } from "framer-motion";
import "./Home.scss";

export const Home = () => {
  const { t } = useTranslation('', { keyPrefix: 'pages.Home' });
  const descriptions: string[] = t('aboutDescriptions', { returnObjects: true });
  const interests: string[] = t('interests', { returnObjects: true });
  const educations: string[] = t('educations', { returnObjects: true });

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
      <MetaTags
        title={t('title')}
        subTitle={t('subTitle')}
        description={descriptions[0]} 
        image={anuImage} 
      />
      <div className="home">
        <Container fluid="md">
          <Row className="my-4">
            <Col sm={5}>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2, duration: 2 }}
              >
                <Image src={anuImage} alt={t('title')} roundedCircle className="main-image" />
              </motion.div>
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
                {descriptions.map(desc => (
                  <p key={uuidv4()} className="text-justify">
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
                  {interests.map(interest => (
                    <li key={uuidv4()}>
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
                  {educations.map(education => (
                    <li key={uuidv4()}>
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
  )
}
